const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./models');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));

// Sync Database
sequelize.sync({alter: true});

// Routers
const indexRouter = require('./routers/index');
const userRouter = require('./routers/users');
const chatRouter = require('./routers/chats');
const groupChatRouter = require('./routers/group_chats');

app.use('/', indexRouter);
app.use('/api', userRouter);
app.use('/api', chatRouter);
app.use('/api', groupChatRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});