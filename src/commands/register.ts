import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { Command } from '../types/Command';
import { TournamentService } from '../services/TournamentService';
import { createSuccessEmbed, createWarningEmbed } from '../utilities/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register for an active tournament'),
    
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    await interaction.deferReply({ ephemeral: true });

    const activeTournaments = await TournamentService.getActiveTournaments();

    if (activeTournaments.length === 0) {
      await interaction.editReply({ embeds: [createWarningEmbed('No Tournaments', 'There are currently no active tournaments to register for.')] });
      return;
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('tournament_register_select')
      .setPlaceholder('Select a tournament to register')
      .addOptions(
        activeTournaments.map(t => ({
          label: t.name,
          description: `${t.game} - ${t.mode} | Fee: $${t.entryFee}`,
          value: t._id.toString(),
        }))
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    await interaction.editReply({ 
      content: 'Please select the tournament you want to register for:',
      components: [row] 
    });
  },
};

export default command;
