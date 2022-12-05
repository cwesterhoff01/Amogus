const db = require("../db");

const customerSchema = new db.Schema({
    email: String,
    passwordHash: String,
    devices: [{deviceId: String,
               deviceName: String,
               deviceToken: String,
               data: [{time: Date,
                       heartRate: Number,
                       spo2: Number}]}]
 });


const Customer = db.model("Customer", customerSchema);

module.exports = Customer;