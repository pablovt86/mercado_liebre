const path = require('path');

const dbProducts = require(path.join(__dirname, '..', 'data', 'dbProducts'));
const dbCategories = require(path.join(__dirname, '..', 'data', 'dbCategorias'));
const fs = require('fs');

module.exports = {
    listar: function(req, res) {
        res.render('products', {
            title: "Productos",
            css: "index.css",
            productos: dbProducts
        })
    },
    detalle: function(req, res) {
        idProducto = req.params.id;
        let producto = dbProducts.filter(producto => {
            return producto.id == idProducto
        })

        res.render('productDetail', {
            title: "Detalle del Producto",
            css: "products.css",
            producto: producto[0]
        })
    },
    agregar: function(req, res) {
        let categoria;
        let sub;
        if (req.query.categoria)
            categoria = req.query.categoria;
        sub = req.query.sub;
        res.render('addProduct', {
            title: "agregar productos",
            categorias: dbCategories,
            categoria: categoria,
            sub: sub

        })
    },
    publicar: function(req, res, netx) {
        //creo un id en puesto 1
        let lastID = 1;
        // recorro la base de datos de products 
        dbProducts.forEach(producto => {
                //pregunto su el id que viene es mayor al id que se crea 
                if (producto.id > lastID) {
                    //bueno guardame el prodctsid en en el id creado
                    lastID = producto.id

                }

            })
            //creo un nuevo objecto
        let newProduct = {
                //con iniciacion +1 id
                //y guado en en atributos lo que viene por el body
                id: lastID + 1,
                category: req.body.category,
                name: req.body.name,
                //pongo el methodo number para que no lo guarde como array a las numeros
                price: Number(req.body.price),
                discount: Number(req.body.discount),
                description: req.body.description,
                image: (req.files[0]) ? req.files[0].filename : "default-images.png"
            }
            //pusheo en la ultima posicion en el array de la base de datos
        dbProducts.push(newProduct)
            //sobre escribo dentro dela carpeta dentro del archivo pdb.json y y convierto el valor del objecto ,lo codifico y lo redireciono a una vista
        fs.writeFileSync(path.join(__dirname, "..", "data", "productsDataBase.json"), JSON.stringify(dbProducts), 'utf-8')
        res.redirect('/products')
    },
    show: function(req, res, next) {
        //guardo en una variable el a id que viene por params
        let idProducto = req.params.id;
        //filtro la basse de datos y guardo el resultado en una variable
        let resultado = dbProducts.filter(producto => {
            return producto.id == idProducto
        })
        res.render('productShow', {
            title: "ver/ editar Producto",
            //guardo en product el resultado del id  y lo inicio en 0
            producto: resultado[0],
            //guardo en el total de la base de datos
            total: dbProducts.length,
            categorias: dbCategories
        })
    },
    edit: function(req, res, next) {
        let idProducto = req.params.id;
        dbProducts.forEach(producto => {
            if (producto.id == idProducto) {
                producto.id = Number(req.body.id);
                producto.name = req.body.name.trim();
                producto.price = Number(req.body.price);
                producto.discount = Number(req.body.discount);
                producto.category = req.body.category.trim();
                producto.description = req.body.description.trim();
                producto.image = (req.files[0]) ? req.files[0].filename : producto.image
            }
        })
        fs.writeFileSync(path.join(__dirname, "..", "data", "productsDataBase.json"), JSON.stringify(dbProducts), 'utf-8')
        res.redirect('/products/show' + idProducto)
    }

}