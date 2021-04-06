const express = require('express');

const routes = express.Router();

//Importanto meu ProductController
const ProductControlller = require('./controllers/ProductController')

//sempre que o usuário acessar a rota será executado o seguinte comando:
routes.get('/products',ProductControlller.index);
//sempre que o usuário acessar um produto específico será executado o seguinte comando:
routes.get('/products/:id', ProductControlller.show);
// ----------------------------------- inserir um novo produto ----------:
routes.post('/products', ProductControlller.store); 
//--------------------------------atualizar um novo produto ------------:
routes.put('/products/:id', ProductControlller.update);
//-----------------apagar um produto-----------------:
routes.delete('/products/:id', ProductControlller.destroy)

//Preciso exportar pois usarei dentro do meu arquivo principal
module.exports = routes;