const connectDB = require('./mongodb-client');
const validator = require('validator');
const UserModel = require('./model/User.js');
const asyncHandler = require('./middleware/async');

connectDB();

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Incorrect id',
});

module.exports.user = (event, context, callback) => {
  if (!validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  UserModel.find({ _id: event.pathParameters.id })
    .then(user =>
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(user),
      })
    )
    .catch(err =>
      callback(null, createErrorResponse(err.statusCode, err.message))
    );
};

module.exports.createUser = asyncHandler(
  async (event, context, callback) => {
    const data = JSON.parse(event.body);
    console.log(event.body);

    const user = new UserModel({
      name: data.name,
      firstname: data.firstname,
      birth: data.birth,
      city: data.city,
      ip: event.requestContext.identity.sourceIp,
    });

    if (user.validateSync()) {
      callback(null, createErrorResponse(400, 'Incorrect user data'));
      return;
    }
    const newUser = await user.save();

    return {
      statusCode: 201,
      body: JSON.stringify(newUser),
    };
  }
);

module.exports.deleteUser = (event, context, callback) => {
  if (!validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  UserModel.remove({ _id: event.pathParameters.id })
    .then(() =>
      callback(null, {
        statusCode: 200,
        body: JSON.stringify('Ok'),
      })
    )
    .catch(err =>
      callback(null, createErrorResponse(err.statusCode, err.message))
    );
};

module.exports.updateUser = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const id = event.pathParameters.id;

  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  const user = new UserModel({
    _id: id,
    name: data.name,
    firstname: data.firstname,
    birth: data.birth,
    city: data.city,
    ip: event.requestContext.identity.sourceIp,
  });

  if (user.validateSync()) {
    callback(null, createErrorResponse(400, 'Incorrect parameter'));
    return;
  }

  dbConnectAndExecute(mongoString, () =>
    UserModel.findByIdAndUpdate(id, user)
      .then(() =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify('Ok'),
        })
      )
      .catch(err =>
        callback(
          err,
          createErrorResponse(err.statusCode, err.message)
        )
      )
  );
};
