import axios from 'axios';
import { House } from './types/house.type';

const BASE_URL: string =
  'http://app-homevision-staging.herokuapp.com/api_project/houses';

const fetchHousesPage = async (page: number, perPage: number) => {
  const response = await axios.get(
    `${BASE_URL}?page=${page}&per_page=${perPage}`
  );
  const data = response.data;
  return data.houses as House[];
};

export const fetchHouses = async (
  page: number = 1,
  perPage: number = 10,
  retries: number = 3,
  backoffMs: number = 1000
): Promise<House[]> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchHousesPage(page, perPage);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'No message';
        if (status >= 500 && status <= 599) {
          console.error(
            `Error fetching page ${page}, attempt ${attempt}. Api response status: ${status}. Api error message: ${message}. Retrying...`
          );
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
      }
      break;
    }
  }
  throw new Error(`Error fetching page ${page} after ${retries} retries`);
};
