import express from 'express';
import cors from 'cors';
import { Tournament } from '../database/models/Tournament';
import { Registration } from '../database/models/Registration';
import { logger } from '../utilities/logger';
import { config } from '../config';

export function setupExpress() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  app.get('/api/tournaments', async (req, res) => {
    try {
      const tournaments = await Tournament.find().sort({ createdAt: -1 });
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
  });

  app.get('/api/stats', async (req, res) => {
    try {
      const totalTournaments = await Tournament.countDocuments();
      const totalRegistrations = await Registration.countDocuments();
      const approvedRegistrations = await Registration.countDocuments({ paymentStatus: 'Approved' });
      
      res.json({
        totalTournaments,
        totalRegistrations,
        approvedRegistrations
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  app.listen(config.api.port, () => {
    logger.info(`Express API listening on port ${config.api.port}`);
  });
}
