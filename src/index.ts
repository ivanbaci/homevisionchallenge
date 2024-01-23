import { fetchHouses } from './apiClient';
import { House } from './types/house.type';

const main = async () => {
  try {
    const houses: House[] = await fetchHouses();
    for (const house of houses) {
      console.log('house:', house);
    }
  } catch (error) {
    console.error(`Error fetching houses:`, error);
  }
};

main().catch(error => {
  console.error('Error:', error);
});
