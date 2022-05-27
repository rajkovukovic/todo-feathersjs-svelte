// todos-model.js - A mongoose model
const uuidv4 = require('uuid').v4;

// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'todos';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const schema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true },
    completed: { type: Boolean, default: false },
    blah: { type: String },
  }, {
    timestamps: true,
    toJSON: {
      getters: true,
      virtuals: true,
      transform: function (doc, ret) {
        console.log({ doc, ret });
        ret.id = ret._id;
        delete ret._id;
      },
    },
  });

  schema.virtual('realId')
    .get(function () { return this._id; })
    .set(function () { this._id ??= this.id; });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
