const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  console.log(req.query);
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', { photos });
};

exports.getPhoto = async (req, res) => {
  //console.log(req.params.id + ' geldi');
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = 'public/uploads/';

  //dosya varmı yokmu kontrol
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  } catch (err) {
    console.error(err);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;

  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
