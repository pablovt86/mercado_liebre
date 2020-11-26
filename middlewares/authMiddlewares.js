function authMiddlewares(req, res, netx) {

    if (req.session.usuarioLogueado != undefined) {
        netx()
    } else {
        ("esta pagina es solo para usuarios")
    }
}


module.exports = authMiddlewares;