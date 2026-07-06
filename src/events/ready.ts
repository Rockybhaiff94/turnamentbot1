import { Events } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { logger } from '../utilities/logger';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: ExtendedClient) {
    logger.info(`Ready! Logged in as ${client.user?.tag}`);
  },
};
