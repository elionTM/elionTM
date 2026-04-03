import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Legal & Business', 'Branding & Marketing', 'Tech & Development']
  },
  images: {
    type: [String],
    required: true,
    validate: [v => Array.isArray(v) && v.length > 0, 'At least one image is required']
  },
  link: {
    type: String
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
