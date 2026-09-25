const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: '',
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    admin1: {
      type: String,
      default: '',
    },
    moodTag: {
      type: String,
      default: 'radiant',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate coordinates
favoriteSchema.index({ latitude: 1, longitude: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
