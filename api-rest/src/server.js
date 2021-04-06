const express = require('express')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))

require('./app/controllers/index')(app)

const PORT = 3001;
app.listen(PORT, () => {
    console.log('The server is running at http://localhost/' + PORT)
})