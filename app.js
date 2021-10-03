const express = require('express');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const fs = require('fs');

const app = express();
const port = 3000;

//dosya çağırma
const Photo = require('./models/Photo');

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//loglama için
// const myLogger = (req, res, next) => {
//   console.log(req.url); //url loglar
//   next();
// };
//app.use(myLogger);

//MIDDLEWARES
//statik dosya belirlenmesi
app.use(express.static('public'));
//request bodysini okumak için gereklidir.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

//ROUTES
//asenkron yapı kullandık
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', { photos });
});

app.get('/about', (req, res) => {
  //res.sendFile(__dirname + '/temp/index.html');
  res.render('about');
});

app.get('/add', (req, res) => {
  //res.sendFile(__dirname + '/temp/index.html');
  res.render('add');
});

app.post('/photos', async (req, res) => {
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
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
});

//id bilgisini aldıktan sonra id ye göre sayfa detaylarını okuyarak ekledik
app.get('/photos/:id', async (req, res) => {
  //console.log(req.params.id + ' geldi');
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', { photo });
});

//update
app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;

  photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
