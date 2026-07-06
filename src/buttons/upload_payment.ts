import { ButtonInteraction } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { createSuccessEmbed } from '../utilities/embeds';

export default {
  customId: 'upload_payment_',
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    // Acknowledge interaction
    await interaction.reply({ 
      content: 'Please upload your payment screenshot to this channel now. Staff will review it shortly.',
      ephemeral: true
    });
  }
};
