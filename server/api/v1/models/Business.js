const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');

const privateKey = readFileSync(`${__dirname}/../../../private.key`);

const BusinessSchema = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
    },
    brand: {
        type: String,
    },
    category: {
        type: String,
        enum: ['Lab','Medicine','Both']
    },
    contact: {
        name: String,
        phone: String,
        email: String,
        altPhone: String
    },
    address: {
        geolocation: {
            latitude: Number,
            longitude: Number
        },
        line1: String,
        line2: String,
        city: String,
        state: String,
        PIN: String,
        landmark: String,
        deliveryRadius: Number
    },
    documents: {
        registration: {
            originalname: String,
            filename: String,
            mimetype: String,
            encoding: String,
            size: Number
        },
        drugLicense: {
            originalname: String,
            filename: String,
            mimetype: String,
            encoding: String,
            size: Number
        },
        certificate: {
            originalname: String,
            filename: String,
            mimetype: String,
            encoding: String,
            size: Number
        },
        tradeLicense: {
            originalname: String,
            filename: String,
            mimetype: String,
            encoding: String,
            size: Number
        }
    }
});

BusinessSchema.methods.sendOtp = function () {

    // code to send OTP goes here
    console.log(`Sent OTP to ${this.phone}`);
    
    return true;
};

BusinessSchema.methods.verifyOtp = function () {

    // code to send OTP goes here
    console.log(`Verified OTP for ${this.phone}`);
    
    return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: { phone: this.phone } }, privateKey, { algorithm: 'RS256'});
};

module.exports = model('Business', BusinessSchema);
