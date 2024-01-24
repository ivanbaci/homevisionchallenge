import axios from 'axios';
import { House } from './types/house.type';
import { callWithRetries } from './apiCaller';

const BASE_URL: string | undefined = process.env.API_URL;

const fetchHousesPage = async (page: number, perPage: number) => {
  if (!BASE_URL) throw new Error('API_URL is not defined');

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
