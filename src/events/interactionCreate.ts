import { Events, Interaction } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { logger } from '../utilities/logger';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: ExtendedClient) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        logger.error(`Error executing command ${interaction.commandName}: ${error}`);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    } else if (interaction.isButton()) {
      let button = client.buttons.get(interaction.customId);
      if (!button) {
        // Fallback to prefix matching
        button = client.buttons.find(b => interaction.customId.startsWith(b.customId));
      }
      if (!button) return;

      try {
        await button.execute(interaction, client);
      } catch (error) {
        logger.error(`Error executing button ${interaction.customId}: ${error}`);
      }
    } else if (interaction.isStringSelectMenu()) {
      const menu = client.selectMenus.get(interaction.customId);
      if (!menu) return;

      try {
        await menu.execute(interaction, client);
      } catch (error) {
        logger.error(`Error executing select menu ${interaction.customId}: ${error}`);
      }
    } else if (interaction.isModalSubmit()) {
      let modal = client.modals.get(interaction.customId);
      if (!modal) {
        // Fallback to prefix matching
        modal = client.modals.find(m => interaction.customId.startsWith(m.customId));
      }
      if (!modal) return;

      try {
        await modal.execute(interaction, client);
      } catch (error) {
        logger.error(`Error executing modal ${interaction.customId}: ${error}`);
      }
    }
  },
};
