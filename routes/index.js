var express = require('express');
var router = express.Router();
const mainController = require('../controllers/mainController')
    /* GET home page. */

router.get('/pruebaSession', function(req, res) {
    if (req.session.numeroVisita == undefined) {
        req.session.numeroVisita = 0;
    }
    req.session.numeroVisita++;
    res.send('Session tiene el numero:' + req.session.numeroVisita)
})
router.get('/', mainController.index);

router.get('/search', mainController.search)

module.exports = router;