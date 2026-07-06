import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import { logger } from '../utilities/logger';

// Extend the Discord.js Client class to include a commands collection
export class TournamentClient extends Client {
  public commands: Collection<string, any>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
    this.commands = new Collection();
  }

  public async start(token: string): Promise<void> {
    try {
      await this.login(token);
      logger.info(`Bot logged in successfully as ${this.user?.tag}`);
    } catch (error) {
      logger.error('Failed to log in', error);
      process.exit(1);
    }
  }
}
