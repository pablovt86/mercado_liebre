function guestMiddlewares(req, res, netx) {

    if (req.session.usuarioLogueado == undefined) {
        netx()
    } else {
        ("esta pagina es solo para invitados")
    }
}


module.exports = guestMiddlewares;