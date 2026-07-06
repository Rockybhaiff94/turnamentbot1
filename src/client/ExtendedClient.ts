import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Command } from '../types/Command';

export class ExtendedClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public buttons: Collection<string, any> = new Collection();
  public selectMenus: Collection<string, any> = new Collection();
  public modals: Collection<string, any> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });
  }
}
