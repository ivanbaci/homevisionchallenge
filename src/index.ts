import 'dotenv/config';
import { fetchHouses } from './apiClient';
import { downloadPhoto, ensureDirectoryExists } from './photoDownloader';
import { House } from './types/house.type';

const main = async () => {
  try {
    const houses: House[] = await fetchHouses();
    console.log(`Fetched ${houses.length} houses`);

    const downloadPath: string =
      process.env.DOWNLOAD_PATH || `${process.cwd()}/photos`;
    ensureDirectoryExists(downloadPath);

    const downloadPromises = houses.map(house => {
      const filename: string = `${house.id}-${house.address}`;
      return downloadPhoto(house.photoURL, filename, downloadPath)
        .then(() =>
          console.log(`Photo for house ${house.id} downloaded successfully.`)
        )
        .catch(error =>
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
