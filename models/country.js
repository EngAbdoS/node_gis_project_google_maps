const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String },
  population: { type: Number },
  Qara: { type: String },
  area: { type: String },
  currency: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: [Number],
  },
});
countrySchema.index({ location: '2dsphere' });

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;
