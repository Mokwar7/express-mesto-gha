const express = require('express');
const mongoose = require('mongoose');
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

app.use(express.json())
app.use('/users', require('./routes/users'))
app.use('/cards', require('./routes/cards'))
app.use('*', (req, res) => {
  res.status(404).send({message: 'Такой страницы не существует.'})
})

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
  console.log(BASE_PATH ? BASE_PATH : 'BASE_PATH не определен');
})
