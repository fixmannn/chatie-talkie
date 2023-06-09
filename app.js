const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./models');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

// Sync Database
sequelize.sync({alter: true});

// Routers
const indexRouter = require('./routers/index');
const userRouter = require('./routers/users');
const chatRouter = require('./routers/chats');
const groupChatRouter = require('./routers/group_chats');

app.set("view engine", "ejs");
app.set("views", "views");

app.use('/', indexRouter);
app.use('/api', userRouter);
app.use('/api', chatRouter);
app.use('/api', groupChatRouter);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});