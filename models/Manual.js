var mongoose = require('mongoose');

var manualSchema = new mongoose.Schema({
  created_by: String,
  company_by: String,
  company: String,
  isActive: Boolean,
  title: String,
  caption: String,
  chapter: [{
    order: Number,
    title: String,
    description: String,
    subcaputulo: [{
      order: Number,
      title: String,
      description: String
    }],
  }],
  updated_at: { type: Date, default: Date.now }
});

manualSchema.pre('save', function(next){
  next();
})

var Manual = mongoose.model('Manual', manualSchema);

module.exports = Manual;