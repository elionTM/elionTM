import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    required: false
  },
  details: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'done', 'closed'],
    default: 'pending'
  }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
