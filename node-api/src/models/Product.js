//Aqui terá todas as informações e propriedades referentes ao meu produto

const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate');


//crio um schema instanciado meu mongoose
const ProductSchema = new mongoose.Schema({
    //Indico os 'campos' necessários para o meu db
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required:true,
    },
    url:{
        type: String,
        required:true
    },
    createAt:{
        type: Date,
        default: Date.now
    }
});

ProductSchema.plugin(mongoosePaginate);

//Indicando que meu 'Product' é um model
mongoose.model('Product', ProductSchema);   