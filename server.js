var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var multer = require('multer');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var app = express();

// Load environment variables from .env file
dotenv.load();

// Passport OAuth strategies
require('./config/passport');

// Controllers
var HomeController = require('./controllers/home');
var userController = require('./controllers/user');
var manualController = require('./controllers/manual');

mongoose.connect('mongodb://' + process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON : function(object) {
      return JSON.stringify(object);
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: 'crazypianopanda', resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.get('/', HomeController.index);
app.get('/users', userController.ensureAuthenticated, userController.ensureAdmin, userController.usersGet);
app.get('/users/:filter', userController.ensureAuthenticated, userController.ensureAdmin, userController.usersSearchGet);
app.post('/users', userController.ensureAuthenticated, userController.ensureAdmin, userController.usersPut);
app.post('/usersrm', userController.ensureAuthenticated, userController.ensureAdmin, userController.deleteUser);
app.get('/account', userController.ensureAuthenticated, userController.accountGet);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
app.post('/addUser', userController.addUser);
app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/logout', userController.logout);
app.get('/manual', userController.ensureAuthenticated, manualController.manualListGet);
app.get('/manual/search/:filter', userController.ensureAuthenticated, manualController.manualListSearchGet);
app.get('/manual/create', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualCreateGet);
app.post('/manual/create', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualCreatePost);
app.get('/manual/show/:id', userController.ensureAuthenticated, manualController.manualShowGet);
app.post('/manual/show/:id', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualShowDelete);
app.get('/manual/edit/:id', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualEditGet);
app.post('/manual/edit/:id', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualEditPut);
// app.post('/manual/editRM', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualEditDelete);
app.get('/manual/newChapter/:id', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualAddChapterGet);
app.post('/manual/newChapter/:id', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualAddChapterPost);
app.get('/manual/editChapter/:id/:chapID', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualEditChapterGet);
app.post('/manual/editChapter/:id/:chapID', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualEditChapterPut);

// favorito
app.get('/favorito/:id', userController.ensureAuthenticated, manualController.favorito);

// sub
app.get('/manual/editChapter/:id/:chapID/adicionar-sub', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualAdicionarSubGet);
app.post('/manual/editChapter/:id/:chapID/adicionar-sub', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualAdicionarSubPut);
app.get('/manual/editChapter/:id/:chapID/adicionar-sub/:subcaputuloId', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualAdicionarSubGetId);
app.post('/manual/editChapter/:id/:chapID/adicionar-sub/:subcaputuloId', userController.ensureAuthenticated, userController.ensureCanPost, manualController.manualAdicionarSubGetIdPost);

var multerConfig = {
  storage: multer.diskStorage({
    //specify destination
    destination: function(req, file, next){
      next(null, path.join(__dirname, 'public/upload'));
    },

    //specify the filename to be unique
    filename: function(req, file, next){
      var ext = file.mimetype.split('/')[1];
      next(null, file.fieldname + '-' + Date.now() + '.'+ext);
    }
  })
};

app.post('/upload', userController.ensureAuthenticated, userController.ensureCanPost, multer(multerConfig).single('photo'), function(req, res){
  let file = req.file.path.split('/').pop()
      file = `${req.protocol}://${req.get('host')}/upload/${file}`

  res.send({
    link: file
  });
});


// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
