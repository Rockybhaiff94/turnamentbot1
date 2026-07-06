import cron from 'node-cron';
import { ExtendedClient } from '../client/ExtendedClient';
import { Tournament } from '../database/models/Tournament';
import { Room } from '../database/models/Room';
import { logger } from '../utilities/logger';
import { createWarningEmbed } from '../utilities/embeds';

export function loadJobs(client: ExtendedClient) {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Find upcoming rooms that haven't started yet
      const rooms = await Room.find({ startTime: { $gt: now } }).populate('tournamentId');

      for (const room of rooms) {
        const timeDiff = room.startTime.getTime() - now.getTime();
        const minutesUntil = Math.floor(timeDiff / (1000 * 60));

        // Let's trigger a reminder at exactly 30 minutes and 10 minutes
        if (minutesUntil === 30 || minutesUntil === 10) {
          const embed = createWarningEmbed(
            `Match Starting in ${minutesUntil} Minutes!`,
            `Your match for **${(room.tournamentId as any).name}** is starting soon!`
          ).addFields([
            { name: 'Room ID', value: room.roomId, inline: true },
            { name: 'Password', value: room.password, inline: true },
            { name: 'Map', value: room.map, inline: true }
          ]);

          for (const userId of room.sentTo) {
            try {
              const user = await client.users.fetch(userId);
              await user.send({ embeds: [embed] });
            } catch (err) {
              logger.warn(`Could not send reminder to ${userId}`);
            }
          }
        }
      }
    } catch (error) {
      logger.error(`Error in cron job: ${error}`);
    }
  });

  logger.info('Cron jobs loaded successfully.');
}
