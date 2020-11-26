const path = require('path')
const dbProducts = require(path.join(__dirname, '..', 'data', 'dbProducts'))


mainController = {
    index: function(req, res) {
        let visitados = dbProducts.filter(producto => {
            return producto.category == "visited"
        })

        let ofertas = dbProducts.filter(producto => {
            return producto.category == "in-sale"
        })

        res.render('index', {
            title: 'Mercado Liebre',
            css: 'index.css',
            visitados: visitados,
            ofertas: ofertas
        });
    },

    search: function(req, res) {
        let buscar = req.query.search;
        let productos = [];
        dbProducts.forEach(producto => {
            //tolowercase machea por las dudas q user escriba en mayuscula y pasa todo a miniscula 
            if (producto.name.toLowerCase().includes(buscar)) { //includes toma el string como un array 
                productos.push(producto) // y pusheo el ultimo array al array vacio
            }
        })
        res.render('products', {
            title: 'Resultado de la busqueda',
            productos: productos
        })
    },
}
module.exports = mainController;