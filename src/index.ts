import 'dotenv/config';
import { fetchHouses } from './apiClient';
import { downloadPhoto } from './photoDownloader';
import { House } from './types/house.type';

const main = async () => {
  try {
    const houses: House[] = await fetchHouses();
    console.log(`Fetched ${houses.length} houses`);

    const downloadPath: string =
      process.env.PHOTO_DOWNLOAD_PATH || `${process.cwd()}/photos`;
    const downloadPromises = houses.map(house => {
      const filename: string = `${house.id}-${house.address}`;
      return downloadPhoto(house.photoURL, filename, downloadPath).catch(
        error =>
          console.error(`Error downloading photo for house ${house.id}:`, error)
      );
    });

    await Promise.all(downloadPromises);
  } catch (error) {
    console.error(`Error fetching houses:`, error);
  }
};

main().catch(error => {
  console.error('Error:', error);
});
