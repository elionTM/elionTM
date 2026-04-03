import Service from '../models/Service.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      userId: req.user._id
    };
    const newProject = new Project(projectData);
    await newProject.save();

    // Emit live update
    const io = req.app.get('io');
    io.emit('projectCreated', newProject);

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    let query = {};
    // If not admin, only show user's own projects
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }
    const projects = await Project.find(query).populate('serviceId');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Emit live update
    const io = req.app.get('io');
    io.emit('projectUpdated', project);

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
