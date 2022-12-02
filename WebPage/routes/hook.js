var express = require('express');
var router = express.Router();
var Customer = require('../models/customer');

// Get data from device
router.post('/', (req, res) => {
    const coreID = req.body.coreid;
    const rxData = req.body.data;
    const rxEvent = req.body.event;
    const rxPublished_at = req.body.published_at;

    console.log(req.body);
    //res.status(200).send('ok');
    
    Customer.findOne({ "devices.deviceID": coreID }), function(err, device) {
        if(err) {
            res.status(500).json({ success: false, message: "Unknown error", error: err });
        }

        else if(!device) {
            //res.status(404).json({ success: false, message: "Device not recognized. Registering device, try again"});

            const newDevice = new Device({ event: rxEvent, data: rxData, time: rxPublished_at, id: coreID});
            newDevice.save(function (err) {
                if (err) {
                    res.status(500).json({ success: false, message: "Unknown error", error: err});
                }
                else {
                    res.status(201).json({ success: true, message: "Device created" });
                }
            })
        }

        else {
            let newData = {
                event: rxEvent,
                data: rxData,
                time: rxPublished_at,
                id: coreID
            };
            device.push(newData);

            device.save(function (err) {
                if (err) {
                    res.status(500).json({ success: false, message: "Unknown error", error: err});
                }
                else {
                    res.status(201).json({ success: true, message: "Updated data"});
                }
            })
        }
    }
});

module.exports = router;