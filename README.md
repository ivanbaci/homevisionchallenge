# HomeVision Challenge

## Steps to run the project

### Prerequisites

- Install Node.js version 20.11.0

### Setup

1. Environment variables

- Create a `.env` file in the project's root directory.
- Follow the format provided in the .env.example file.
- The DOWNLOAD_PATH variable is optional and has a default value.
- If you provide a DOWNLOAD_PATH, ensure it's an accessible location on your computer.
- The program will create the specified download path if it doesn't exist, provided it's an accessible location.

### Run the project

1. Install dependencies

```
npm install
```

2. Build the project

```
npm run build
```

3. Start application

```
npm run start
```

4. Execution check
   - To check if application is working correctly, the user could check the specified folder to see if photos have been downloaded. Additionally, the terminal will display some logs that describe the process.

### Solution

#### Why Node.js

- **Familiarity**: my existing proficiency with Node.js and its associated tools significantly influenced the decision. This familiarity allowed for quicker development and debugging.
- **Rich ecosystem**: Node.js has a vast ecosystem with numerous libraries and tools, making it easier to find and use packages like axios for HTTP requests and dotenv for environment variable management.
- **Asynchronous nature**: Node.js's non-blocking I/O model is well-suited for handling multiple I/O operations, such as API requests and file operations, efficiently.

Other languages like Rust or Go could also be suitable, as they have a high performance and efficiency, especially in concurrent operations. However, considering the previous reasons that I mentioned and specially my existing expertise with Node.js, it was the chosen one.

#### Key points

- **Non-Blocking concurrency**: using `Promise.all` to download photos allow me to do it concurrently as Node.js initiates all the download operations almost simultaneously, jumping from one operation to another when it has 'dead' slots in which it have to wait some tasks to finish. This avoids waiting for each photo to be downloaded before starting the next one.This is a simple way to manage this kind of operations. Then it waits for all the downloading tasks to finish.
- **Retries**: when the server fails with server error, the program waits for a certain period and then retries the call to the API. The period time is incremented each time that the server fails, in order to give some time to it to recover. The number of retries could be configurable.

#### TODO list

- **Handle existing files**: add logic to check if a file with the same name already exists when downloading photos, and handle the situation appropriately (e.g., rename, skip, or overwrite).
- **Retry photo download**: implement a retry mechanism for photo downloads in case of failures, similar to the exponential backoff used for API requests.
- **Enhance command line interface**: extend the application to accept and process command line arguments for greater flexibility. This includes the page to fetch from the api, the number of houses to fetch in each page, the number of retries when fetching the houses and the backoffMs to wait between retries.
