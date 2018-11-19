var async = require('async');
var Manual = require('../models/Manual');

function firstDuplicate(a) {
  console.log('--------------------------');
  console.log('-- Validating duplicate --');
  console.log('--------------------------');
  var store = new Set();
  for(var i=0; i<a.length; i++){
    if(store.has(a[i])){
      return a[i];
    }
    store.add(a[i])
  }
  return -1;
}

/**
 * GET /manual
 */
exports.manualListGet = function (req, res) {
  Manual.find({$or:[{isActive:true}, {created_by:req.user.name}]}, function(err, manual){
    if(!err){
      res.render('manual/list', {
        manual: manual
      });
    }else{
      req.flash('error', err);
      res.render('manual/list', {
        manual: manual
      });
    }
  });
}

/*
 * GET /manual/search/:filter
 */
exports.manualListSearchGet = function(req, res) {
  Manual.find({
      $and: [
        {$or:[{isActive:true}, {created_by:req.user.name}]},
        { $or:[ 
          {title: new RegExp(req.params.filter, 'i')}, 
          {caption: new RegExp(req.params.filter, 'i')},
          {chapter: {$elemMatch: {title: new RegExp(req.params.filter, 'i')}}},
          {chapter: {$elemMatch: {description: new RegExp(req.params.filter, 'i')}}},
        ]}
      ]}, function(err, manual){
    if(!err){
      res.render('manual/list', {
        manual: manual
      });
    }else{
      req.flash('error', err);
      res.render('manual/list', {
        manual: manual
      });
    }
  });
}

// db.manuals.find({chapter: {$elemMatch: {order: 4}}}).pretty() -- use this example to search inside chapters

/**
 * GET /create
 */
exports.manualCreateGet = function (req, res) {
  res.render('manual/create', {
    company: req.user.company
  });
}

/**
 * POST /create
 */
exports.manualCreatePost = function (req, res) {
  req.assert('title', 'Titulo não pode ser vazio').notEmpty();
  req.assert('caption', 'Subtitulo não pode ser vazio').notEmpty();
  req.assert('description', 'Descrição não pode ser vazia').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/manual/create');
  }
  var chapter = []; //obj => order - title - description
  var isActive;
  if(req.body.isActive){
    isActive = req.body.isActive;
  }else{
    isActive = false;
  }
  manual = new Manual({
    created_by: req.user.name,
    company: req.user.company,
    isActive: isActive,
    title: req.body.title,
    caption: req.body.caption,
    chapter:[{
      order: req.body.order,
      title: req.body.cTitle,
      description: req.body.description
    }]
  });
  manual.save(function(err) {
    if(err){
      req.flash('error', err);
      return res.redirect('/manual/create');
    }
    req.flash('success', { msg: 'Manual salvo !! ' })
    res.redirect('/manual/create');
  });
}

/**
 * GET /manual/show/:id
 */
exports.manualShowGet = function (req, res) {
  Manual.findOne({_id: req.params.id}).exec(function(err, manual){
    if(!err){
      var Chapters = {data:[]};
      for(var i=0; i < manual.chapter.length; i++){
        Chapters.data.push({idd: manual.chapter[i]._id, title:manual.chapter[i].title, description:manual.chapter[i].description, order:manual.chapter[i].order});
        console.log(Chapters.data[i].title);
        console.log(Chapters.data[i].order);
      }
      Chapters.data = Chapters.data.sort(function(obj1, obj2) {return obj1.order - obj2.order});
      console.log(Chapters);
      res.render('manual/show',{
        title: manual.title,
        company: manual.company,
        caption: manual.caption,
        isActive: manual.isActive,
        _id: manual._id,
        chapters: Chapters,
        canPost: req.user.canPost
      });
    }else{
      req.flash('error', err);
      res.redirect('/manual/show/' + req.params.id);
    }
  });
}

/**
 * DELETE /manual/show/:id
 */
exports.manualShowDelete = function (req, res) {
  Manual.remove({_id: req.params.id}, function(err) {
    if(!err) {
      req.flash('success', { msg: 'Manual removido !! ' });
      res.redirect('/manual');
    }
    else {
      req.flash('error', err);
      res.redirect('/manual/show/' + req.params.id);
    }
  });

}

/**
 * GET /manual/edit/:id
 */
exports.manualEditGet = function (req, res) {
  Manual.findOne({_id: req.params.id}).exec(function(err, manual){
    if(!err){
      var Chapters = {data:[]};
      for(var i=0; i < manual.chapter.length; i++){
        Chapters.data.push({title:manual.chapter[i].title, description:manual.chapter[i].description, _id:manual.chapter[i]._id, manId: manual._id, order:manual.chapter[i].order});
      }
      Chapters.data = Chapters.data.sort(function(obj1, obj2) {return obj1.order - obj2.order});
      res.render('manual/edit',{
        idd: manual._id,
        title: manual.title,
        company: manual.company,
        caption: manual.caption,
        isActive: manual.isActive,
        chapters: Chapters
      });
    }else{
      req.flash('error', err);
      res.redirect('/manual/show/' + req.params.id);
    }
  });
}

/**
 * PUT /manual/edit/:id
 */
exports.manualEditPut = function (req, res) {
  Manual.findByIdAndUpdate(req.params.id, { $set: { isActive: req.body.isActive, title: req.body.title, caption: req.body.caption }}, function (err, manual) {
    if (!err) {
      req.flash('success', { msg: 'Manual alterado com sucesso ! ' });
      res.redirect('/manual/show/'+req.params.id);
    }else{
      req.flash('error', err);
      res.redirect('/manual/edit/' + req.params.id);
    }
  });
}



/**
 * PUT /manual/editRM
 */
exports.manualEditDelete = function (req, res) {
  var linkId = req.body.manID;
  Manual.update({_id:req.body.manID},{$pull:{chapter: {_id:req.body.chapID}}}, function(err) {
    if(!err) {
      req.flash('success', { msg: 'Capitulo removido !! ' });
      res.redirect('/manual/show/' + linkId);
    }
    else {
      req.flash('error', err);
      res.redirect('/manual/show/' + linkId);
    }
  });
}

/**
 * GET /manual/editChapter/:id/:chapID
 */
exports.manualEditChapterGet = function (req, res) {
  Manual.findOne({_id: req.params.id, "chapter._id":req.params.chapID},{"chapter.$": 1}).exec(function(err, manual){
    if(!err){
      res.render('manual/editChapter',{
        title: manual.title,
        caption: manual.caption,
        order: manual.chapter[0].order,
        cTitle: manual.chapter[0].title,
        description: manual.chapter[0].description
      });
      //  res.send(manual);
    }else{
      req.flash('error', err);
      res.redirect('/manual/edit/' + req.params.id);
      // res.send(err);
    }
  });
}

/**
 * PUT /manual/editChapter/:id/:chapID
*/
exports.manualEditChapterPut = function (req, res) {
  var checkOrder = true
  Manual.findOne({_id: req.params.id}, function(errr, man){
    if(!errr){
      var arrOrder = [parseInt(req.body.order)];
      for(var i=0; i < man.chapter.length; i++){
        if(man.chapter[i]._id == req.params.chapID){
          if(man.chapter[i].order == parseInt(req.body.order)){
            checkOrder = false
          }
        }
        arrOrder.push(man.chapter[i].order);
      }

      if(!!checkOrder){
        if(firstDuplicate(arrOrder) > 0){
          req.flash('error', { msg: 'Número do Capitulo já cadastrado. '});
          res.redirect('/manual/editChapter/'+req.params.id+'/'+req.params.chapID);
        }else{
          Manual.update({_id: req.params.id, "chapter._id":req.params.chapID}, { $set: {"chapter.$.order":req.body.order, "chapter.$.title":req.body.cTitle, "chapter.$.description":req.body.description}}, function (err, manual) {
            if (!err) {
              req.flash('success', { msg: 'Capitulo alterado com sucesso ! ' });
              res.redirect('/manual/edit/'+req.params.id);
            }else{
              req.flash('error', err);
              res.redirect('/manual/edit/' + req.params.id);
            }
          });
        }
      }else{
        Manual.update({_id: req.params.id, "chapter._id":req.params.chapID}, { $set: {"chapter.$.order":req.body.order, "chapter.$.title":req.body.cTitle, "chapter.$.description":req.body.description}}, function (err, manual) {
          if (!err) {
            req.flash('success', { msg: 'Capitulo alterado com sucesso ! ' });
            res.redirect('/manual/edit/'+req.params.id);
          }else{
            req.flash('error', err);
            res.redirect('/manual/edit/' + req.params.id);
          }
        });
      }
    }else{
      req.flash('error', errr);
      res.redirect('/manual/edit/'+req.params.id);
    }
  });
}

/**
 * GET /manual/newChapter/:id
 */
exports.manualAddChapterGet = function (req, res) {
  Manual.findOne({_id: req.params.id}).exec(function(err, manual){
    if(!err){
      res.render('manual/createChapter', {
        id:req.params.id,
        title: manual.title,
        caption: manual.caption
      })
      //res.send(manual);
    }else{
      req.flash('error', err);
      res.redirect('/manual/edit/' + req.params.id);
      //res.send(err);
    }
  });
}

/**
 * POST /manual/newChapter/:id
 */
exports.manualAddChapterPost = function (req, res) {
  Manual.findOne({_id: req.params.id}, function(errr, man){
    if(!errr){
      var arrOrder = [parseInt(req.body.order)];
      for(var i=0; i < man.chapter.length; i++){
        arrOrder.push(man.chapter[i].order);
      }
      if(firstDuplicate(arrOrder) > 0){
        req.flash('error', { msg: 'Número do Capitulo já cadastrado. '});
        res.redirect('/manual/newChapter/'+req.params.id);
      }else{
        var newChapter = {
          order: req.body.order,
          title: req.body.cTitle,
          description: req.body.description
        }
        Manual.findByIdAndUpdate(req.params.id,{$push:{chapter:newChapter}}, function (err, manual) {
          if (!err) {
            req.flash('success', { msg: 'Manual alterado com sucesso ! ' });
            res.redirect('/manual/show/'+req.params.id);
          }else{
            req.flash('error', err);
            res.redirect('/manual/edit/' + req.params.id);
          }
        });
      }
    }else{
      req.flash('error', errr);
      res.redirect('/manual/edit/'+req.params.id);
    }
  })
}


// db.manuals.find({$and: [{_id: ObjectId("5b1718032a2db041f580c53c")}, {chapter.$: 66}]}).pretty()

// db.manuals.find({chapter: {$elemMatch: {order: 4}}}).pretty() -- use this example to search inside chapters