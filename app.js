const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const { PORT = 3000, BASE_PATH } = process.env;
const app = express();


mongoose
  .connect('mongodb://0.0.0.0:27017/mestodb', {
    useNewUrlParser: true,
    })
  .then((res) => {
    console.log('DB is connected')
  })
  .catch((err) => {
    console.log(err + ' or smth another')
})


app.use((req, res, next) => {
  req.user = {
    _id: '64a98ecce59ba66fded06755'
  }

  next()
})

app.use(bodyParser.json())
app.use('/users', require('./routes/users'))
app.use('/cards', require('./routes/cards'))
app.use('*', (res, req) => {

})

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
  console.log(BASE_PATH ? BASE_PATH : 'BASE_PATH не определен');
})
