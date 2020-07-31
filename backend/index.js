const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

require('./connection')(app)
app.listen(port)
console.log('API server start on : ' + port)


