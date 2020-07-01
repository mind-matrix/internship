const { Model, DataTypes, Deferrable, Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');

const { Document } = require('./index');

const privateKey = readFileSync(`${__dirname}/../../../private.key`);

class Business extends Model {
    sendOtp() {
        console.log(`Sent OTP to ${this.phone}`);
        return true;
    }

    verifyOtp = function () {
        // code to send OTP goes here
        console.log(`Verified OTP for ${this.phone}`);
        return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: { id: this.id, phone: this.phone } }, privateKey, { algorithm: 'RS256'});
    }
}

module.exports = (sequelize) => {

    Business.init({
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        phone: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        name: DataTypes.STRING,
        brand: DataTypes.STRING,
        category: DataTypes.ENUM(['Lab','Medicine','Both'])
    }, {
        sequelize,
        indexes: [
            {
                unique: true,
                fields: ['phone']
            }
        ]
    });

    return Business;
};
