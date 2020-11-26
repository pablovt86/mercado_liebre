const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
let multer = require('multer');
let path = require('path');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/products')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })

router.get('/', productsController.listar);

router.get('/detail/:id', productsController.detalle);
router.get('/add', productsController.agregar);
router.get('/add/form', productsController.agregar);
router.post('/add/form', upload.any(), productsController.publicar);
router.get('/show/:id', productsController.show);
router.put('/edit/:id', upload.any(), productsController.edit);
module.exports = router;