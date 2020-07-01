const express = require('express');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');

const auth = require('./controllers/auth');

const { Business, Document, Contact, Address, BusinessTest, Test } = require('./models');

const upload = multer({ dest: 'uploads/' });

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET api listing. */
router.get('/', (req, res) => {
  res.send({ online: true });
});

router.post('/register', async function (req, res) {
  const phone = req.body.phone;
  let business = await Business.findOne({ where: { phone } });
  if(!business) {
    const business = new Business({
      phone
    }, { include: [ Contact, Address, { model: Document, as: 'documents' } ] });
    await business.save();
    const sent = business.sendOtp();
    res.status(200).send({
      created: true,
      sent
    });
  } else if (!business.verified) {
    const sent = business.sendOtp();
    res.status(200).send({
      created: true,
      sent
    });
  } else {
    res.status(200).send({
      created: false,
      sent: false
    });
  }
});

router.post('/request', async function (req, res) {
  const phone = req.body.phone;
  let business = await Business.findOne({ where: { phone } });
  if (!business) {
    res.status(404).send();
  } else {
    const sent = business.sendOtp();
    res.status(200).send({
      sent
    });
  }
});

router.post('/login', async function (req, res) {
  const phone = req.body.phone;
  const otp = req.body.otp;
  let business = await Business.findOne({ where: { phone } });
  if (business) {
    token = business.verifyOtp(otp);
    if (token) {
      if (!business.verified) {
        business.verified = true;
        await business.save();
      }
      res.status(200).send({
        verified: business.verified,
        token
      });
    } else {
      res.status(200).send({
        verified: business.verified,
        token: null
      });
    }
  } else {
    res.status(403).send();
  }
});

router.post('/update', auth, upload.fields([
  { name: 'registration', maxCount: 1 },
  { name: 'drugLicense', maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
  { name: 'tradeLicense', maxCount: 1 },
]), async function (req, res) {

  const phone = req.context.data.phone;

  let business = await Business.findOne({ where: { phone } });

  if (req.body.name) {
    business.name = req.body.name;
  }
  if (req.body.brand) {
    business.brand = req.body.brand;
  }
  if (req.body.category) {
    business.category = req.body.category;
  }

  if (req.body.contact) {
    let contact = new Contact(JSON.parse(req.body.contact));
    await contact.save();
    business.setContact(contact);
  }

  if (req.body.address) {
    let address = new Address(JSON.parse(req.body.address));
    await address.save();
    business.setAddress(address);
  }

  if (req.files) {
    console.log(req.files);
    let document_ids = [];

    for (document of ["registration", "drugLicense", "certificate", "tradeLicense"]) {
      if (req.files[document]) {
        let doc = new Document(req.files[document][0]);
        await doc.save();
        document_ids.push(doc.id);
      }
    }

    if (document_ids.length > 0) {
      business.setDocuments(document_ids);
    }
  }

  if (req.body.tests) {
    
    if (req.body.tests.add) {
      for (t of req.body.tests.add) {
        let test = new BusinessTest(t);
        await test.save();
        business.addTest(test);
      }
    }

    if (req.body.tests.remove) {
      // do something
    }

  }

  await business.save();
  
  res.status(200).send({
    updated: true
  });
});

router.get('/me', auth, async function (req, res) {
  const phone = req.context.data.phone;

  let business = await Business.findOne({
    where: { phone },
    include: [
      Contact,
      Address,
      { model: Document, as: 'documents' },
      { model: BusinessTest, as: 'tests', include: [ Test ] }
    ]
  });

  res.send(business.toJSON());
});

router.get('/entity/test', async function (req, res) {
  let tests = await Test.findAll();
  res.send(tests.map((node) => node.get({ plain: true })));
});

router.post('/entity/test/:id', auth, async function (req, res) {

  let id = req.context.data.id;
  let testId = req.params.id;
  let price = req.body.price;

  let test = await BusinessTest.findOne({
    where: {
      id: testId,
      BusinessId: id
    }
  });

  if (test) {
    test.price = price;
    await test.save();
    res.send({
      updated: true
    });
  } else  {
    res.status(404).send();
  }
});

router.delete('/entity/test/:id', auth, async function (req, res) {
  let id = req.context.data.id;
  let testId = req.params.id;

  let nrows = await BusinessTest.destroy({
    where: {
      id: testId,
      BusinessId: id
    }
  });

  if (nrows > 0) {
    res.send({
      deleted: true
    });
  } else {
    res.status(500).send();
  }
});

module.exports = router;