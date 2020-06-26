const { Model, DataTypes } = require('sequelize');

class Contact extends Model {}

module.exports = (sequelize) => {
    Contact.init({
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: DataTypes.STRING,
        altPhone: DataTypes.STRING,
    }, {
        sequelize
    });
    
    return Contact;
};
