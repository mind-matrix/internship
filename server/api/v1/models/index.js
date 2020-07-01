const { Sequelize } = require('sequelize');
const { appendFile } = require('fs');

function slogger(msg) {
    if (process.env.SQL_LOG_FILE) {
        appendFile(process.env.SQL_LOG_FILE, msg, (err) => {
            if (err) console.error(err);
        });
    }
}

const sequelize = new Sequelize(process.env.DB_URL, {
    logging: slogger
});

const models = {
    Contact: require('./Contact')(sequelize),
    Address: require('./Address')(sequelize),
    Document: require('./Document')(sequelize),
    Test: require('./Test')(sequelize),
    BusinessTest: require('./BusinessTest')(sequelize),
    Business: require('./Business')(sequelize)
};

models.BusinessTest.Test = models.BusinessTest.belongsTo(models.Test);

models.Business.Contact = models.Business.hasOne(models.Contact, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
models.Contact.Business = models.Contact.belongsTo(models.Business);
models.Business.Address = models.Business.hasOne(models.Address, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
models.Address.Business = models.Address.belongsTo(models.Business);
models.Business.Documents = models.Business.hasMany(models.Document, { as: 'documents', onDelete: 'CASCADE' });
models.Document.Business = models.Document.belongsTo(models.Business);
models.Business.BusinessTests = models.Business.hasMany(models.BusinessTest, { as: 'tests', onDelete: 'CASCADE' });
models.BusinessTest.Business = models.BusinessTest.belongsTo(models.Business);

sequelize.authenticate().then(async () => {
    console.log(`Connection to Database has been established.`);
    sequelize.sync().then(() => {
        console.log(`Database Synchronization complete.`);
    }).catch((error) => {
        console.error(error);
    });
}).catch((error) => {
    console.error(error);
    process.exit(1);
});

module.exports = models;