import { Router, type Request, type Response } from 'express';
import historyService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';

const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  try {
    // Get weather data from OpenWeather via our service
    const weatherData = await weatherService.getWeatherForCity(city);

    // Save city to our search history
    await historyService.addCity(city);

    // Send weather array (first index is current, rest is forecast)
    return res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await historyService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error reading history:', error);
    res.status(500).json({ error: 'Failed to read search history.' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const removedCity = await historyService.removeCity(id);
    if (!removedCity) {
      return res.status(404).json({ error: 'City not found'});
    }

    return res.json(removedCity);
  }
  catch (error){
    console.error('Error deleting city:', error);
    return res.status(500).json({ error: 'Failed to delete city.' });
  }
});

export default router;
