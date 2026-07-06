import fs from 'fs';
import path from 'path';
import { ExtendedClient } from '../client/ExtendedClient';
import { logger } from '../utilities/logger';

export function loadEvents(client: ExtendedClient) {
  const eventsPath = path.join(__dirname, '../events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath).default;
    
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
  
  logger.info(`Successfully loaded ${eventFiles.length} events.`);
}
