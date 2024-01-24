import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import path from 'path';

export const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const downloadPhoto = async (
  photoUrl: string,
  filename: string,
  downloadPath: string
): Promise<void> => {
  try {
    const response: AxiosResponse = await axios.get(photoUrl, {
      responseType: 'stream'
    });

    let extension: string = path.extname(photoUrl).toLowerCase();
    if (!extension && response.headers['content-type']) {
      const contentType = response.headers['content-type'];
      const splittedContentType = contentType.split('/');
      if (splittedContentType.length === 2) {
        extension = '.' + splittedContentType[1];
      }
    }

    const fullPath: string = path.join(downloadPath, filename + extension);
    const writer: fs.WriteStream = fs.createWriteStream(fullPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading photo from ${photoUrl}:`, error);
    throw error;
  }
};
