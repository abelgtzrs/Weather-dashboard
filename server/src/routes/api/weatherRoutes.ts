import { Router, type Request, type Response } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
import HistoryService from '../../service/historyService';

// import WeatherService from '../../service/weatherService.js';
import weatherService from '../../service/weatherService';
import { error } from 'console';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({error: 'City name is required.'});
  }
  // TODO: GET weather data from city name
  // TODO: save city to search history
  try {
    const weatherData = await weatherService.getWeatherByCity(city);

    // Save to search history (optional)
    await HistoryService.addCityToHistory(city);

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});


});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
