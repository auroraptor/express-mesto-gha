const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

// mongoose.createConnection('mongodb://localhost:27017/mestodb');

mongoose.connect('mongodb://localhost:27017/mestodb');
// .asPromise()
// // eslint-disable-next-line no-console
//   .then(() => console.log('connected to the server'))
// // eslint-disable-next-line no-console
//   .catch((err) => console.log('error: ', err.message));

// подключаемся к серверу mongo
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   // useMongoClient: true,
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

app.use('/', router); // запускаем

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
