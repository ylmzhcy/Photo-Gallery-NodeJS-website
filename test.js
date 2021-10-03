const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//connect DB
mongoose.connect('mongodb://localhost:27017/testpatika', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//create schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
});

const Photo = mongoose.model('Photo', PhotoSchema);

//create a photo
// Photo.create({
//   title: 'Photo Title 1',
//   description: 'Photo 1 Description Lorem Ipsum',
// });

//read Photo

Photo.find({}, (err, data) => {
  console.log(data);
});
