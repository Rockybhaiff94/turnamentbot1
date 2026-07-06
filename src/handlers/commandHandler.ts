import fs from 'fs';
import path from 'path';
import { ExtendedClient } from '../client/ExtendedClient';
import { logger } from '../utilities/logger';
import { REST, Routes } from 'discord.js';
import { config } from '../config';

export async function loadCommands(client: ExtendedClient) {
  const commandsPath = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  const slashCommands = [];

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath).default;
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      slashCommands.push(command.data.toJSON());
    } else {
      logger.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

  // Register slash commands globally (or guild-specific for faster dev)
  const rest = new REST({ version: '10' }).setToken(config.bot.token);

  if (!config.bot.clientId || !config.bot.guildId) {
    logger.error('CRITICAL ERROR: CLIENT_ID or GUILD_ID is missing from your environment variables! Commands CANNOT be registered. Please add them in Railway.');
    return;
  }

  try {
    logger.info(`Started refreshing ${slashCommands.length} application (/) commands.`);

    await rest.put(
      Routes.applicationGuildCommands(config.bot.clientId, config.bot.guildId),
      { body: slashCommands },
    );

    logger.info(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    logger.error(`Error registering commands: ${error}`);
  }
}
