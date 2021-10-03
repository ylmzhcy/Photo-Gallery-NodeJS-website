const express = require('express');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

//dosya çağırma
const photoController = require('./controllers/photoControllers');
const pageController = require('./controllers/pageControllers');

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
//about Page
app.get('/about', pageController.getAboutPage);
//Add Post Page
app.get('/add', pageController.addPostPage);
//Edit Page
app.get('/photos/edit/:id', pageController.getEditPage);

//Create post
app.post('/photos', photoController.createPhoto);
//Read Get Post
app.get('/photos/:id', photoController.getPhoto);
//Update
app.put('/photos/:id', photoController.updatePhoto);
//Delete Post
app.delete('/photos/:id', photoController.deletePhoto);

//Get All Posts
app.get('/', photoController.getAllPhotos);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
