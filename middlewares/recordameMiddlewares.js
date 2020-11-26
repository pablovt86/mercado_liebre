function recordameMiddlewares(req, res, netx) {
    netx()
    if (req.cookies.recordame != undefined && req.session.usuariosLogueado == undefined) {
        let usuarioJson = fs.readFileSync("usuarios.json", { encoding: 'utf-8' });
        let usuarios;
        if (usuarioJson == "") {
            usuarios = [];

        } else {
            usuarios = JSON.parse(usuarioJson)
        }
        let usuariosALoguearse

        for (let i = 0; i < usuarios.length; i++) {
            if (req.body.email == req.cookies.recordame) {
                usuariosALoguearse = usuarios[i];
                break;
            }

        }
        req.session.usuarioLogueado = usuariosALoguearse;


    }
}
module.exports = recordameMiddlewares