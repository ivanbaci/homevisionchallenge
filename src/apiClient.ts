import axios from 'axios';
import { House } from './types/house.type';

const BASE_URL: string =
  'http://app-homevision-staging.herokuapp.com/api_project/houses';

export const fetchHouses = async (
  page: number = 1,
  perPage: number = 10
): Promise<House[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}?page=${page}&per_page=${perPage}`
    );
    const data = response.data;
    return data.houses as House[];
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    throw error;
  }
};
