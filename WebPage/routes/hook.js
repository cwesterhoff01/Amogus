var express = require('express');
var router = express.Router();

// webhook consumer
router.post("/", (req, res) => {
    console.log(req.body);
    res.status(200).send('ok');
});

module.exports = router;