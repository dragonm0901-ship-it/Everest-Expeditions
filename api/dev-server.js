import { createLocalApiApp } from './app.js';

const app = createLocalApiApp();
const port = Number(process.env.API_PORT || 8787);

const server = app.listen(port, () => {
  console.log(`Local API running at http://localhost:${port}`);
});

function shutdown(signal) {
  console.log(`Shutting down local API (${signal})...`);

  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
      return;
    }

    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
