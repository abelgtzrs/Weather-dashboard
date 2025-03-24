import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  date: string;
  icon: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;

  constructor(data: any) {
    this.date = data.date;
    this.icon = data.icon;
    this.description = data.description;
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.windSpeed = data.windSpeed;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  // Stores as class level properties
  private baseForecastURL = 'https://api.openweathermap.org/data/2.5';
  private baseGeocodeURL = 'http://api.openweathermap.org/geo/1.0/direct';
  private apiKey = process.env.OPENWEATHER_API_KEY;
  private city = '';
  // TODO: Create fetchLocationData method
  // Calls geocoding API to get coordinates from a city name.
  private async fetchLocationData(query: string): Promise<any[]> {
    const url = `${this.baseGeocodeURL}?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  // Takes the geocoding response and pulls out lat and lon
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseGeocodeURL}?q=${this.city}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseForecastURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData =  await this.fetchLocationData(this.city);
    return this.destructureLocationData(locationData[0]);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise <any> {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const current = response.list[0];
    return new Weather({
      date: current.dt_txt,
      icon: current.weather[0].icon,
      description: current.weather[0].description,
      temperature: current.main.temp,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
    });
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, list: any[]): Weather[] {
    const forecast: Weather[] = [];

    for (let i = 0; i < list.length; i += 8) {
      const item = list[i];
      forecast.push(
        new Weather({
          date: item.dt_txt,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
          temperature: item.main.temp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        })
      )
    }
    return [currentWeather, ...forecast];
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const current = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(current, weatherData.list);
    return forecast;
  }
}

export default new WeatherService();
