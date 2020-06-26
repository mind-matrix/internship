const { Sequelize } = require('sequelize');
const { appendFile } = require('fs');
const { resolve } = require('path');

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
    Business: require('./Business')(sequelize)
};

models.Business.Contact = models.Business.hasOne(models.Contact);
models.Business.Address = models.Business.hasOne(models.Address);
models.Business.Documents = models.Business.hasMany(models.Document, { as: 'documents' })

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