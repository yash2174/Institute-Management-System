import app from './app.js';
import { initDatabase } from './config/database.js';
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log('Institute Management System Backend');
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Admin: admin@institute.com / admin123`);
      console.log('Ready for requests');
    });
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
};
startServer();
