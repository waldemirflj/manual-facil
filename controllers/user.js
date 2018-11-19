var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');

/**
 * Validate Permissions
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    //req.flash('error', { msg: 'Você não tem permissão para visualizar esta página. --' });
    res.redirect('/login');
  }
};

/**
 * Validate Permissions
 */
exports.ensureAdmin = function(req, res, next) {
  if (req.user.isAdmin === true || req.user.email === "laion.camargo@gmail.com") {
    next();
  } else {
    req.flash('error', { msg: 'Você não tem permissão para visualizar esta página.' });
    res.redirect('/');
  }
};

/**
 * Validate Permissions
 */
exports.ensureCanPost = function(req, res, next) {
  if (req.user.canPost === true) {
    next();
  } else {
    req.flash('error', { msg: 'Você não tem permissão para visualizar esta página.' });
    res.redirect('/');
  }
};

/**
 * GET /login
 */
exports.loginGet = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login'); //, {layout:false}
};

/**
 * POST /login
 */
exports.loginPost = function(req, res, next) {
  req.assert('email', 'Email inválido').isEmail();
  req.assert('email', 'Email não pode ser vazio').notEmpty();
  req.assert('password', 'Senha não poder ser vazio').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (!user) {
      req.flash('error', info);
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      res.redirect('/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 */
exports.signupGet = function(req, res) {
  res.render('account/signup');
};

/**
 * POST /signup
 */
exports.signupPost = function(req, res, next) {
  req.assert('name', 'Nome não pode ser vazio').notEmpty();
  req.assert('email', 'Email inválido').isEmail();
  req.assert('email', 'Email não pode ser vazio').notEmpty();
  req.assert('password', 'Senhas devem possuir no minimo 4 caracteres').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/signup');
  }

  User.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
      req.flash('error', { msg: 'Este email já está em uso.' });
      return res.redirect('/signup');
    }
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      company: req.body.company,
      isAdmin: false,
      canPost: false
    });
    user.save(function(err) {
      req.flash('success', { msg: 'Usuário ' + req.body.email + ' criado com sucesso!'})
      res.redirect('/signup');
    });
  });
};

/**
 * GET /account
 */
exports.accountGet = function(req, res) {
  res.render('account/profile', {
    title: 'My Account'
  });
};

/**
 * PUT /account
 * Update profile information OR change password.
 */
exports.accountPut = function(req, res, next) {
  if ('password' in req.body) {
    req.assert('password', 'Senhas devem possuir no minimo 4 caracteres').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  } else {
    req.assert('name', 'Nome não pode ser vazio').notEmpty();
    req.assert('email', 'Email inválido').isEmail();
    req.assert('email', 'Email não pode ser vazio').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if ('password' in req.body) {
      user.password = req.body.password;
    } else {
      user.email = req.body.email;
      user.name = req.body.name;
    }
    user.save(function(err) {
      if ('password' in req.body) {
        var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD
          }
        });
        var mailOptions = {
          from: 'support@yourdomain.com',
          to: user.email,
          subject: 'Sua senha no sistema X foi alterada!',
          text: 'Olá,\n\n' +
          'Esta é uma confirmação que a senha da conta ' + user.email + ' foi alterada!.\n'
        };
        transporter.sendMail(mailOptions, function(err) {
          console.log('mail sent :D');
        });
        req.flash('success', { msg: 'Sua senha foi alterada com suesso.' });
      } else if (err && err.code === 11000) {
        req.flash('error', { msg: 'Este email já está em uso.' });
      } else {
        req.flash('success', { msg: 'Dados atualizados com sucesso.' });
      }
      res.redirect('/account');
    });
  });
};


/**
 * GET /forgot
 */
exports.forgotGet = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 */
exports.forgotPost = function(req, res, next) {
  req.assert('email', 'Email inválido').isEmail();
  req.assert('email', 'Email não pode ser vazio').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', { msg: 'O email ' + req.body.email + ' não existe.' });
          return res.redirect('/forgot');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      console.log(token);
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'support@yourdomain.com',
        subject: '- Reset de senha -',
        text: 'Para gerar uma  nova senha favor clicar no link:'+
        'http://' + req.headers.host + '/reset/' + token + '\n\n' 
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'Um email foi enviado para ' + user.email + ' com as instruções para resetar a senha.' });
        res.redirect('/forgot');
      });
    }
  ]);
};

/**
 * GET /reset
 */
exports.resetGet = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User.findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        req.flash('error', { msg: 'Token inválido ou expirado.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset
 */
exports.resetPost = function(req, res, next) {
  req.assert('password', 'Senhas devem possuir no minimo 4 caracteres').len(4);
  req.assert('confirm', 'Senhas não são iguais').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            req.flash('error', { msg: 'Token inválido ou expirado.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        from: 'support@yourdomain.com',
        to: user.email,
        subject: 'Sua senha no sistema X foi alterada!',
        text: 'Olá,\n\n' +
        'Esta é uma confirmação que a senha da conta ' + user.email + ' foi alterada!.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Sua senha foi alterada com sucesso!.' });
        res.redirect('/account');
      });
    }
  ]);
};

/**
 * GET /users
 */
exports.usersGet = function(req, res) {
  User.find({}, function(err, user){
    if(!err){
      res.render('account/users',{
        users: user
      });
    }
  });
};

/*
 * GET /users/:filter
 */
exports.usersSearchGet = function(req, res) {
  User.find({ $or:[ {name: new RegExp(req.params.filter, 'i')}, {email: new RegExp(req.params.filter, 'i')}, {company: new RegExp(req.params.filter, 'i')}]}, function(err, user){
    if(!err){
      res.render('account/users', {
        users: user
      });
    }else{
      req.flash('error', err);
      res.render('account/users', {
        users: user
      });
    }
  });
}

/**
 * PUT /account
 * Change Permissions.
 */
exports.usersPut = function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if(req.body.isAdmin){
      user.isAdmin = req.body.isAdmin;
    }else{
      user.isAdmin = false;
    }
    if(req.body.canPost){
      user.canPost = req.body.canPost;
    }else{
      user.canPost = false;
    }

    user.save(function(err) {
      req.flash('success', { msg: 'Permissões para o usuário ' + req.body.email + ' foram alteradas com sucesso!' });
      res.redirect('/users');
    });
  });
};

/* 
 * Register user
 */
exports.addUser = function(req, res) {
  req.assert('company', 'Empresa não pode ser vazio').notEmpty();
  req.assert('email', 'Email inválido').isEmail();
  req.assert('email', 'Email não pode ser vazio').notEmpty();
  req.assert('name', 'Nome não pode ser vazio').notEmpty();
  req.assert('password', 'Senhas devem possuir no minimo 4 caracteres').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/users');
  }

  User.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
      req.flash('error', { msg: 'Já existe uma conta ultizando este email.' });
      return res.redirect('/users');
    }
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      company: req.body.company,
      isAdmin: false,
      canPost: false
    });
    user.save(function(err) {
      req.flash('success', { msg: 'Usuário ' + req.body.email + ' criado com sucesso!!'})
      res.redirect('/users');
    });
  });

}

/**
 * DELETE /usersrm
 */
exports.deleteUser = function (req, res) {
  User.remove({email: req.body.email}, function(err) {
    if(!err) {
      req.flash('success', { msg: 'Usuário removido!! ' });
      res.redirect('/users');
    }
    else {
      req.flash('error', err);
      res.redirect('/users');
    }
  });
}