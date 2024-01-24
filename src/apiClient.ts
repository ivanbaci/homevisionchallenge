import axios from 'axios';
import { House } from './types/house.type';
import { callWithRetries } from './apiCaller';

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
  return await callWithRetries(
    () => fetchHousesPage(page, perPage),
    retries,
    backoffMs
  );
};
