import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { callWithRetries } from '../src/apiCaller';

describe('callWithRetries', () => {
  const mockAxios = new AxiosMockAdapter(axios);

  afterEach(() => {
    mockAxios.reset();
  });

  it('should successfully return data on first try', async () => {
    const mockData = 'response';
    mockAxios.onGet('url').reply(200, { mockData });

    const result = await callWithRetries(() => axios.get('url'), 3, 1);
    expect(result.status).toBe(200);
    expect(result.data).toMatchObject({ mockData });
    expect(mockAxios.history.get.length).toBe(1);
  });

  it('should retry on failure and succeed on second try', async () => {
    const mockData = 'response';

    mockAxios.onGet('url').replyOnce(503);
    mockAxios.onGet('url').replyOnce(200, mockData);

    const result = await callWithRetries(() => axios.get('url'), 3, 1);
    expect(result.data).toBe(mockData);
    expect(mockAxios.history.get.length).toBe(2);
  });

  it('should throw error after all retries failed', async () => {
    mockAxios.onGet('url').reply(503);

    await expect(callWithRetries(() => axios.get('url'), 3, 1)).rejects.toThrow(
      'Call failed after all retries'
    );
    expect(mockAxios.history.get.length).toBe(3);
  });
});
