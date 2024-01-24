import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { fetchHouses } from '../src/apiClient';
import { House } from '../src/types/house.type';

const mockAxios = new AxiosMockAdapter(axios);

describe('fetchHousesPage', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it('should successfully fetch houses', async () => {
    const mockHouses: House[] = [
      {
        id: 0,
        address: '4 Pumpkin Hill Street Antioch, TN 37013',
        homeowner: 'Nicole Bone',
        price: 105124,
        photoURL:
          'https://image.shutterstock.com/image-photo/big-custom-made-luxury-house-260nw-374099713.jpg'
      },
      {
        id: 1,
        address: '495 Marsh Road Portage, IN 46368',
        homeowner: 'Rheanna Walsh',
        price: 161856,
        photoURL:
          'https://media-cdn.tripadvisor.com/media/photo-s/09/7c/a2/1f/patagonia-hostel.jpg'
      }
    ];

    mockAxios.onGet(`${process.env.API_URL}?page=1&per_page=10`).reply(200, {
      houses: mockHouses
    });

    const houses = await fetchHouses();
    expect(houses).toEqual(mockHouses);
  });

  it('should retry fetching houses on failure', async () => {
    mockAxios
      .onGet(`${process.env.API_URL}?page=1&per_page=10`)
      .replyOnce(503)
      .onGet(`${process.env.API_URL}?page=1&per_page=10`)
      .reply(200, { houses: [] });

    const houses = await fetchHouses(1, 10, 3, 1);
    expect(houses).toEqual([]);
    expect(mockAxios.history.get.length).toBe(2);
  });
});
