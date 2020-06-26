const { Model, DataTypes } = require('sequelize');

class Address extends Model {}

module.exports = (sequelize) => {
    Address.init({
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        line1: {
            type: DataTypes.TEXT('tiny'),
            allowNull: false
        },
        line2: DataTypes.TEXT('tiny'),
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        PIN: DataTypes.STRING,
        landmark: DataTypes.TEXT('tiny'),
        deliveryRadius: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        sequelize
    });
    
    return Address;
};
