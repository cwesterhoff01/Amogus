const db = require("../db");

const Device = db.model("Device", {
    event: {type: String, required: true},
    data: {type: Number},
    time: {type: Date},
    id: {type: String}
});

module.exports = Device;