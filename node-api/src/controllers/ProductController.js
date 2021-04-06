//Importantd o mongoose
const mongoose = require('mongoose');

const Product = mongoose.model('Product');

module.exports = {
        async index(req, res){

            const { page = 1 } = req.query;


            //Só executa após conseguir buscar as informações dentro do banco de dados
            const products = await Product.paginate({},{page, limit:10});

            return res.json(products)
        },

        //mostrando detalhes do meu produto
        async show(req, res){

            const product =  await Product.findById(req.params.id)

            return res.json(product);
        },

        async store(req, res){

            //Adicionando produto ao meu bd.
            const product = await Product.create(req.body);
            return res.json(product)
         },

         async update(req, res){
             const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
             return res.json(product);
         },

         async destroy(req, res){
             await Product.findByIdAndRemove(req.params.id);

             return res.send();
         }
}