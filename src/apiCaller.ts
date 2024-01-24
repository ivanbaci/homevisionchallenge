import axios from 'axios';

export const callWithRetries = async <T>(
  call: () => Promise<T>,
  retries: number = 3,
  backoffMs: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await call();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'No message';
        if (status >= 500 && status <= 599) {
          // TODO: handle other errors than server errors
          console.error(`Attempt ${attempt} - Error ${status}: ${message}`);
          if (attempt < retries) {
            const waitTime = backoffMs * attempt;
            console.log(`Retrying in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
      }
      break;
    }
  }

  throw new Error('Call failed after all retries'); // TODO: add error details
};
