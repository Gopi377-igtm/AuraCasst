const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    moodId: {
      type: String,
      required: true,
      enum: ['radiant', 'serene', 'cozy', 'gloomy', 'stormy', 'tranquil'],
    },
    moodName: {
      type: String,
      required: true,
    },
    cityName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: '',
    },
    temperatureC: {
      type: Number,
    },
    weatherDescription: {
      type: String,
    },
    note: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

moodLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('MoodLog', moodLogSchema);
