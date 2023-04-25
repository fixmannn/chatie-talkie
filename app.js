const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));

// Routers
const indexRouter = require('./routers/index');
const userRouter = require('./routers/users');

app.use('/', indexRouter);
app.use('/api', userRouter);



app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});