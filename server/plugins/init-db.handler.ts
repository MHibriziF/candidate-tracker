import { initDb } from '../data/init-db';

export default defineNitroPlugin(async () => {
  try {
    await initDb();
    console.log('Database initialized');
  } catch (err) {
    console.error('DB init failed', err);
  }
});
