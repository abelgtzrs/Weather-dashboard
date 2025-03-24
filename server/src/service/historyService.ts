import { readFile, writeFile } from 'fs/promises';
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
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      // Update the path if needed (this assumes "server/db/searchHistory.json")
      const filePath = path.join(__dirname, '..', 'db', 'searchHistory.json');
      const data = await readFile(filePath, 'utf8');

      // Parse and return the array of City objects
      return JSON.parse(data) as City[];
    } catch (err: any) {
      // If the file doesn't exist, return an empty array instead of throwing
      if (err.code === 'ENOENT') {
        return [];
      }
      // If there's any other error, rethrow
      throw err;
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]):Promise<void> {
    try {
      const filePath = path.join(__dirname, '..', 'db', 'searchHistory.json');
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

    // Create a new city with a unique ID
    const newCity: City = {
      id: Date.now().toString(),
      name: cityName
    };

    // Add the new city to the array
    cities.push(newCity);

    // Write the updated array back to the file
    await this.write(cities);

    return newCity;
  }
  public async removeCity(id: string): Promise<City | null> {
    // 1. Read existing cities
    const cities = await this.read();
  
    // 2. Locate the city by its ID
    const index = cities.findIndex(city => city.id === id);
  
    // 3. If not found, return null (or throw an error, up to you)
    if (index === -1) {
      return null;
    }
  
    // 4. Remove the city from the array
    const [removedCity] = cities.splice(index, 1);
  
    // 5. Write the updated array to searchHistory.json
    await this.write(cities);
  
    // 6. Return the removed city, if needed
    return removedCity;
  }
}

export default HistoryService;
