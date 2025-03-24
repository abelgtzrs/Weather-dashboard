import express from 'express';
import HistoryService from '../../service/historyService';



const historyRouter = express.Router();
const historyService = new HistoryService();

historyRouter.get('/', async (_req, res) => {
  try {
    const cities = await historyService.getCities();
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve history.' });
  }
});

// POST /api/history
historyRouter.post('/', async (req, res) => {
  try {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required.' });
    }
    const newCity = await historyService.addCity(cityName);
    return res.json(newCity);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to add city.' });
  }
});

// DELETE /api/history/:id
historyRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removedCity = await historyService.removeCity(id);
    if (!removedCity) {
      return res.status(404).json({ error: 'City not found.' });
    }
    return res.json(removedCity);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to remove city.' });
  }
});

export default historyRouter;
