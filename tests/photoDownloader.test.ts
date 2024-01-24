import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import fs from 'fs';
import { PassThrough } from 'stream';
import { downloadPhoto } from '../src/photoDownloader';

const mockAxios = new AxiosMockAdapter(axios);

describe('downloadPhoto', () => {
  beforeEach(() => {
    jest.spyOn(fs, 'createWriteStream').mockImplementation(() => {
      const mockStream = new PassThrough();
      process.nextTick(() => mockStream.emit('finish'));
      return mockStream as unknown as fs.WriteStream;
    });
  });

  afterEach(() => {
    mockAxios.restore();
    jest.restoreAllMocks();
  });

  it('should download a photo and save it to a file', async () => {
    const photoUrl = 'http://example.com/photo.jpg';
    const filename = 'photo';
    const downloadPath = process.env.DOWNLOAD_PATH || `${process.cwd()}/photos`;

    const downloadStream = new PassThrough();
    downloadStream.push('fake image data');
    downloadStream.push(null);
    mockAxios.onGet(photoUrl).reply(200, downloadStream);

    await downloadPhoto(photoUrl, filename, downloadPath);

    expect(fs.createWriteStream).toHaveBeenCalledWith(
      `${downloadPath}/${filename}.jpg`
    );
  });
});
