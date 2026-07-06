import { EmbedBuilder, ColorResolvable } from 'discord.js';
import { config } from '../config';

const DEFAULT_COLOR: ColorResolvable = '#2b2d31'; // Discord dark theme color
const SUCCESS_COLOR: ColorResolvable = '#57F287';
const ERROR_COLOR: ColorResolvable = '#ED4245';
const WARNING_COLOR: ColorResolvable = '#FEE75C';

export class PremiumEmbed extends EmbedBuilder {
  constructor() {
    super();
    this.setColor(DEFAULT_COLOR);
    this.setTimestamp();
    // Default footer can be set here or per embed
    this.setFooter({ text: 'Top Tournament System' });
  }
}

export const createSuccessEmbed = (title: string, description: string) => {
  return new PremiumEmbed()
    .setColor(SUCCESS_COLOR)
    .setTitle(`✅ ${title}`)
    .setDescription(description);
};

export const createErrorEmbed = (title: string, description: string) => {
  return new PremiumEmbed()
    .setColor(ERROR_COLOR)
    .setTitle(`❌ ${title}`)
    .setDescription(description);
};

export const createWarningEmbed = (title: string, description: string) => {
  return new PremiumEmbed()
    .setColor(WARNING_COLOR)
    .setTitle(`⚠️ ${title}`)
    .setDescription(description);
};
