const { Model, DataTypes } = require('sequelize');
const { Business } = require('./index');

class Document extends Model {}

module.exports = (sequelize) => {
    Document.init({
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        originalname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mimetype: DataTypes.STRING,
        encoding: DataTypes.STRING,
        size: DataTypes.BIGINT
    }, {
        sequelize
    });

    return Document;
};
