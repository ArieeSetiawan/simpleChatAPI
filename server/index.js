const express = require ('express');
const cors = require('cors');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const userRoutes= require ('./routes/user-routes');
const chatRoutes = require ('./routes/chat-routes')

app.use('/users', userRoutes);
app.use('/chats', chatRoutes)

const server = app.listen(process.env.PORT,()=>{
    console.log(`Listening on Port ${process.env.PORT}`)
});

module.exports = server