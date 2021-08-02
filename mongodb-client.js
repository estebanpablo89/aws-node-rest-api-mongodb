'use strict';

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://web:mongoweb@estebancluster.wtfwr.mongodb.net/aws-rest-api?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log('Could not connect to mongodb', err.message);
  }
};

module.exports = connectDB;
