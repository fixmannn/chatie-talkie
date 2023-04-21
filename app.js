const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());

// Routers
const indexRouter = require('./routers/index');
app.use('/', indexRouter);




app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});