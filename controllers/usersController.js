let fs = require('fs');
let bcrypt = require('bcrypt');
let { check, validationResult, body } = require('express-validator');
let dbProductos = require('../data/dbProducts');
/* GET home page. */
usersController = {
    register: function(req, res) {
        res.render('register')
    },
    create: function(req, res, next) {

        let errors = validationResult(req);


        if (errors.isEmpty()) {
            //guardar Usuarios
            // primero: leer lo que viene
            let usuarioJson = fs.readFileSync("usuarios.json", { encoding: "utf-8" });
            // si el archivo esta vacio bueno 
            let usuarios;
            if (usuarioJson == "") {
                usuarios = [];
            } else {
                //pero si no esta vacio bueno descomprime el archivo
                usuarios = JSON.parse(usuarioJson);
            }

            let usuario = {
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    edad: req.body.edad,
                    email: req.body.email,
                    contra: bcrypt.hashSync(req.body.contra, 10),
                    avatar: req.files[0].filename

                }
                // a la lista de usuarios le agrego un usuario nuevo
            usuarios.push(usuario);
            // la empaqueto de nuevo al archivo json
            usuariosJSON = JSON.stringify(usuarios)
                // y lo envio el objecto al la vista
            fs.writeFileSync("usuarios.json", usuariosJSON)

            res.redirect('/users/list');
        } else {
            res.render('register', { errors: errors.errors })
        }
    },
    edit: function(req, res) {
        let idUser = req.params.idUser;

        const users = [{
                id: 1,
                nombre: 'pablo',
                apellido: 'vacotti',
                edad: 32
            },
            {
                id: 2,
                nombre: 'juli',
                apellido: 'cardozo',
                edad: 28
            },
            {
                id: 3,
                nombre: 'delfi',
                apellido: 'cardozo',
                edad: 12
            },
            {
                id: 4,
                nombre: 'tahiel',
                apellido: 'vaccotti',
                edad: 9
            },
            {
                id: 5,
                nombre: 'zoe',
                apellido: 'vaccotti',
                edad: 7
            }
        ];
        let userToEdit = users[idUser];

        res.render('userEdit', { userToEdit: userToEdit });

    },

    login: function(req, res) {

        res.render('login')
    },
    procesoLogin: function(req, res) {

        let errors = validationResult(req);
        if (errors.isEmpty()) {

            let usuarioJson = fs.readFileSync("usuarios.json", { encoding: 'utf-8' });
            let usuarios;
            if (usuarioJson == "") {
                usuarios = [];

            } else {
                usuarios = JSON.parse(usuarioJson)
            }

            for (let i = 0; i < usuarios.length; i++) {
                if (req.body.email == usuarios[i].email) {
                    if (bcrypt.compareSync(req.body.contra, usuarios[i].contra)) {

                        var usuariosALoguearse = usuarios[i];
                        break;
                    }
                }
            }
            if (usuariosALoguearse == undefined) {
                return res.render('login', {
                    errors: [
                        { msg: 'Credenciales invalido' }

                    ]
                });

            }
            req.session.usuarioLogueado = usuariosALoguearse;

            if (req.body.recordame != undefined) {
                res.cookie('recordame', usuariosALoguearse.email, { maxAge: 60000 })
            }


            res.render('success')
        } else {
            return res.render('login', { errors: errors.errors })
        }


        res.send('error')
    },


    list: function(req, res) {


        const users = [{
                id: 1,
                nombre: 'pablo',
                apellido: 'vacotti',
                edad: 32
            },
            {
                id: 2,
                nombre: 'juli',
                apellido: 'cardozo',
                edad: 28
            },
            {
                id: 3,
                nombre: 'delfi',
                apellido: 'cardozo',
                edad: 12
            },
            {
                id: 4,
                nombre: 'tahiel',
                apellido: 'vaccotti',
                edad: 9
            },
            {
                id: 5,
                nombre: 'zoe',
                apellido: 'vaccotti',
                edad: 7
            }
        ];


        res.render('list', { 'users': users });



    },
    search: function(req, res) {
        buscarUsuario = req.query.search

        const users = [{
                id: 1,
                nombre: 'pablo',
                apellido: 'vacotti',
                edad: 32
            },
            {
                id: 2,
                nombre: 'juli',
                apellido: 'cardozo',
                edad: 28
            },
            {
                id: 3,
                nombre: 'delfi',
                apellido: 'cardozo',
                edad: 12
            },
            {
                id: 4,
                nombre: 'tahiel',
                apellido: 'vaccotti',
                edad: 9
            },
            {
                id: 5,
                nombre: 'zoe',
                apellido: 'vaccotti',
                edad: 7
            }
        ];
        //guardo en el array vacio los usuarios encontrados
        let resultadosUsers = [];
        // arrancamos del usuario 0 y me fijo lo usuario que y voy sumando de uno
        for (let i = 0; i < users.length; i++) {
            //preguntamos si encuentra el usuario que se busca
            if (users[i].nombre.includes(buscarUsuario)) {
                //pushea dentro del array el celular encontrado
                resultadosUsers.push(users[i])
            }
        }
        res.render('resultadosUsers', { resultadosUsers: resultadosUsers })
    },
    profile: function(req, res) {
        res.render('userProfile', {
            title: 'perfil de usuario',
            productos: dbProductos.filter(producto => {
                return producto.category != "visited " && producto.category != "in-sale"
            })
        })
    }



}

module.exports = usersController;