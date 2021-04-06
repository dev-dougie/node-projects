//Importando o meu arquivo express
const express = require('express')

//Importando minha bibliioteca 'require-dir'
const requireDir = require('require-dir')

//importando o CORS
const cors = require('cors');

//Importando o meu arquivo mongoose para trabalhar com o database Mongo
const mongoose = require('mongoose')

//Executando a função 'express' | Iniciando o app
const app = express();

//Permitir que eu envie dados para a aplicação no formato de JSON
app.use(express.json())

//Permitindo acesso a todos os domínios através do CORS
app.use(cors());

//Iniciando meu banco de dados 
mongoose.connect('mongodb://localhost:27017/nodeapi', {useNewUrlParser: true})
//useNewUrlParser: Objeto de parâmetro utilizado para passar uma única informação ao concetar com a URL.

requireDir('./src/models')

const Product = mongoose.model('Product')

//Primeira rota
app.use('/api', require('./src/routes'));

//'Ouvindo' a porta 3001 do meu navegador
app.listen(3001)