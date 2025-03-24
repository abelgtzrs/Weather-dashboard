import { Router, type Request, type Response } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
import historyService from '../../service/historyService.js';

// import WeatherService from '../../service/weatherService.js';
//import weatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('🔥 POST /api/weather hit');
    console.log('📥 Body:', req.body);

    const { city } = req.body;

    if (!city) {
      console.log('❌ No city provided in request body');
      return res.status(400).json({ error: 'City name is required.' });
    }

    console.log('✅ City received:', city);

    const dummyWeather = [
      {
        date: "Today",
        icon: "01d",
        description: "clear",
        temperature: 70,
        windSpeed: 5,
        humidity: 50
      }
    ];

    console.log('📤 Sending mock weather data');
    return res.json(dummyWeather);

  } catch (error) {
    console.error('💥 Error in POST /api/weather:', error);
    return res.status(500).json({ error: 'Server error in POST /api/weather' });
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
