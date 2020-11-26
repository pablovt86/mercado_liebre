var express = require('express');
var router = express.Router();
var usersController = require('../controllers/usersController');
let multer = require('multer');
let path = require('path');
let fs = require('fs');
let { check, validationResult, body } = require('express-validator');
let logDBMiddlewares = require('../middlewares/logDBMiddlewares');
let guestMiddlewares = require('../middlewares/guestMiddlewares');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'avatar/images')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/login', usersController.login);
router.post('/login', [
    check('email').isEmail().withMessage('email incorrecto'),
    check('contra').isLength({ min: 6 }).withMessage('debe tener mas de 6 caracteres')
], usersController.procesoLogin);

router.get('/register', guestMiddlewares, usersController.register);
router.get('/profile', usersController.profile);
router.post('/register', logDBMiddlewares, upload.any(), [
    check('nombre').isLength({ min: 1 }).withMessage('Este Campo Nombre Debe Estar Completo'),
    check('apellido').isLength({ min: 1 }).withMessage('Este Campo  Apellido No Puede Estar Vacio'),
    check('email').isEmail().withMessage('El Email Debe Ser Un Email Valido'),
    check('contra').isLength({ min: 6 }).withMessage('El Password Debe Tener 6 Caracteres'),
    check('edad').isInt({ min: 1 }).withMessage('ponga su edad'),
    body('email').custom(function(value) {
        let usersJson = fs.readFileSync("usuarios.json", { encoding: 'utf-8' });
        let users;
        if (usersJson == "") {
            users = [];

        } else {
            users = JSON.parse(usersJson)
        }
        for (let i = 0; i < users.length; i++) {
            // si el usuario tiene el mismo valor  que quiero checkear bueno tira falso por q ya tenemos un registro con el mismo email
            if (users[i].email == value) {
                return false;
            }
        }
        return true;
    }).withMessage('Usuario ya registrado')

], usersController.create);
router.get('/check', function(req, res) {
    if (req.session.usuarioLogueado == undefined) {
        res.send("no estas logueado")
    } else {
        res.send("estas logueado usuario" + req.session.usuarioLogueado.email)
    }

})
router.get('/search', usersController.search);
router.get('/list', usersController.list);
router.get('/edit/:idUser', usersController.edit);
router.put('/edit', function(req, res) {
    res.send("fui por put");
});
router.delete('/delete/:userId', function(req, res) {
    res.send("soy delete");
});



module.exports = router;