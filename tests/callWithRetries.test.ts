import axios from 'axios';
import { callWithRetries } from '../src/apiCaller';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('callWithRetries', () => {
  it('should successfully return data on first try', async () => {
    const mockData = 'response';
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await callWithRetries(() => axios.get('url'), 3, 1000);
    expect(result).toMatchObject({ data: mockData });
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
