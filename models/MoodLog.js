const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema(
  {
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

module.exports = mongoose.model('MoodLog', moodLogSchema);
