const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

const URL = 'mongodb://localhost/api-rest'
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('The database was connected succesfully!'))
.catch(err => console.log('Oops, looks like we have an error --> ' +err))

module.exports = mongoose;
