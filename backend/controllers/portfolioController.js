import Portfolio from '../models/Portfolio.js';

export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find().populate('serviceId');
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPortfolioItem = async (req, res) => {
  try {
    const newItem = new Portfolio(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePortfolioItem = async (req, res) => {
  try {
    const updatedItem = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePortfolioItem = async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
