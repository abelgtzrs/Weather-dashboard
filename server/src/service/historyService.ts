import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const filePath = path.join(__dirname, '..', '..', 'db', 'searchHistory.json');
      const data = await readFile(filePath, 'utf8');
      return JSON.parse(data) as City[];
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]):Promise<void> {
    try {
      const filePath = path.join(__dirname, '..', '..', 'db', 'searchHistory.json');
      const data = JSON.stringify(cities, null, 2);
      await writeFile(filePath, data, 'utf8');
    } catch (err){
      throw err;
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    const newCity: City = {
      id: Date.now().toString(),
      name: cityName
    };

    cities.push(newCity);

    await this.write(cities);

    return newCity;
  }
  public async removeCity(id: string): Promise<City | null> {
    const cities = await this.read();
    const index = cities.findIndex(city => city.id === id);
    if (index === -1) {
      return null;
    }
    const [removedCity] = cities.splice(index, 1);
    await this.write(cities);
    return removedCity;
  }
}

export default new HistoryService;
