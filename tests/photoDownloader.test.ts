import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import fs from 'fs';
import { PassThrough } from 'stream';
import { downloadPhoto, ensureDirectoryExists } from '../src/photoDownloader';

const mockAxios = new AxiosMockAdapter(axios);

describe('ensureDirectoryExists', () => {
  jest.mock('fs');

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the directory if it does not exist', () => {
    const path = '/test/path';
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {
      return '';
    });

    ensureDirectoryExists(path);

    expect(fs.existsSync).toHaveBeenCalledWith(path);
    expect(fs.mkdirSync).toHaveBeenCalledWith(path, { recursive: true });
  });

  it('should not try to create the directory if it already exists', () => {
    const path = '/test/path';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');

    ensureDirectoryExists(path);

    expect(fs.existsSync).toHaveBeenCalledWith(path);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });
});

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
