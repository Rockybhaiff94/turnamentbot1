import { StringSelectMenuInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { TournamentService } from '../services/TournamentService';
import { createErrorEmbed } from '../utilities/embeds';
import { RegistrationService } from '../services/RegistrationService';

export default {
  customId: 'tournament_register_select',
  async execute(interaction: StringSelectMenuInteraction, client: ExtendedClient) {
    const tournamentId = interaction.values[0];

    const tournament = await TournamentService.getTournamentById(tournamentId);
    if (!tournament) {
      return interaction.reply({ embeds: [createErrorEmbed('Error', 'Tournament not found or no longer active.')], ephemeral: true });
    }

    const isRegistered = await RegistrationService.isUserRegistered(interaction.user.id, tournamentId);
    if (isRegistered) {
      return interaction.reply({ embeds: [createErrorEmbed('Duplicate Registration', 'You have already registered for this tournament.')], ephemeral: true });
    }

    const modal = new ModalBuilder()
      .setCustomId(`register_modal_${tournamentId}`)
      .setTitle(`Register for ${tournament.name}`);

    const ignInput = new TextInputBuilder()
      .setCustomId('ign')
      .setLabel("Your In-Game Name (IGN)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const uidInput = new TextInputBuilder()
      .setCustomId('uid')
      .setLabel("Your Game UID")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const teamInput = new TextInputBuilder()
      .setCustomId('team_name')
      .setLabel("Team Name")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const captainInput = new TextInputBuilder()
      .setCustomId('captain_name')
      .setLabel("Captain Name")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const notesInput = new TextInputBuilder()
      .setCustomId('notes')
      .setLabel("Any Notes (Optional)")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(ignInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(uidInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(teamInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(captainInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(notesInput)
    );

    await interaction.showModal(modal);
  }
};
