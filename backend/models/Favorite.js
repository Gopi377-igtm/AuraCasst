const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
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

favoriteSchema.index({ user: 1, latitude: 1, longitude: 1 });

module.exports = mongoose.model('Favorite', favoriteSchema);
