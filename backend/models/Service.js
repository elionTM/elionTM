import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Legal & Business', 'Branding & Marketing', 'Tech & Development']
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
