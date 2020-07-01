const { Model, DataTypes } = require('sequelize');

class BusinessTest extends Model {}

module.exports = (sequelize) => {

    BusinessTest.init({
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        sequelize,
        indexes: [
            {
                unique: true,
                fields: [ 'BusinessId', 'TestId' ]
            }
        ]
    });

    return BusinessTest;
};