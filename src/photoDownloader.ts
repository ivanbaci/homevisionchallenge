import axios from 'axios';
import fs from 'fs';
import path from 'path';

const PROJECT_BASE_DIR = process.cwd();

export const downloadPhoto = async (
  photoUrl: string,
  filename: string,
  downloadFolder: string
): Promise<void> => {
  try {
    const response = await axios.get(photoUrl, {
      responseType: 'stream'
    });

    let extension = path.extname(photoUrl).toLowerCase();
    if (!extension) {
      const contentType = response.headers['content-type'];
      const splittedContentType = contentType.split('/');
      if (splittedContentType.length === 2) {
        extension = '.' + splittedContentType[1];
      }
    }

    const downloadPath = path.join(
      PROJECT_BASE_DIR,
      downloadFolder,
      filename + extension
    );
    const writer = fs.createWriteStream(downloadPath);

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
