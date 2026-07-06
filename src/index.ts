import { ExtendedClient } from './client/ExtendedClient';
import { config } from './config';
import { logger } from './utilities/logger';
import mongoose from 'mongoose';

const client = new ExtendedClient();

async function bootstrap() {
  try {
    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(config.database.uri);
    logger.info('Connected to MongoDB successfully.');

    // Initialize Express server if needed
    // ...

    // Load Handlers (Commands, Events, Components)
    logger.info('Loading handlers...');
    const { loadCommands } = await import('./handlers/commandHandler');
    const { loadEvents } = await import('./handlers/eventHandler');
    const { loadComponents } = await import('./handlers/componentHandler');

    await loadCommands(client);
    loadEvents(client);
    loadComponents(client);

    // Login to Discord
    logger.info('Logging into Discord...');
    await client.login(config.bot.token);
    logger.info('Logged into Discord successfully.');
  } catch (error) {
    logger.error(`Failed to bootstrap application: ${error}`);
    process.exit(1);
  }
}

bootstrap();
