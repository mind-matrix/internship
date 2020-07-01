const { Model, DataTypes } = require('sequelize');

class Test extends Model {}

module.exports = (sequelize) => {

    Test.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize
    });

    return Test;
};