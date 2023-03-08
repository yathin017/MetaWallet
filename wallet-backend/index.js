const mongoose = require('mongoose');
const express = require('express');
const app = express();

// mangooose.connect('mongodb://localhost:27017/MetaWallet.User-Data', { useNewUrlParser: true});
// const db = mongoose.connection
// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log("Connected to Database"))

app.use(express.json())
const users = require('./routes/users')
app.use('/users', users)

app.listen(3001, () => console.log("Server Started"));