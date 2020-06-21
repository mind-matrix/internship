const express = require('express');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');

const auth = require('./controllers/auth');

const { Business } = require('./models');

const upload = multer({ dest: 'uploads/' });

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET api listing. */
router.get('/', (req, res) => {
  res.send({ online: true });
});

router.post('/register', async function (req, res) {
  const phone = req.body.phone;
  let business = await Business.findOne({ phone });
  if(!business) {
    const business = new Business({
      phone
    });
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
  let business = await Business.findOne({ phone });
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
  let business = await Business.findOne({ phone });
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
  
  let data = {
    name: req.body.name,
    brand: req.body.brand
  };
  
  data.contact = JSON.parse(req.body.contact);
  data.address = JSON.parse(req.body.address);
  
  data.documents = {
    registration: req.files.registration[0],
    drugLicense: req.files.drugLicense[0],
    certificate: req.files.certificate[0],
    tradeLicense: req.files.tradeLicense[0]
  };

  let business = await Business.findOne({ phone });
  await business.update(data);
  await business.save();
  
  res.status(200).send({
    updated: true
  });
});

module.exports = router;