import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { Command } from '../types/Command';
import { TournamentService } from '../services/TournamentService';
import { createSuccessEmbed, createErrorEmbed } from '../utilities/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('tournament')
    .setDescription('Manage tournaments')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new tournament')
        .addStringOption(option => option.setName('name').setDescription('Tournament Name').setRequired(true))
        .addStringOption(option => option.setName('game').setDescription('Game (e.g., Free Fire)').setRequired(true))
        .addNumberOption(option => option.setName('slots').setDescription('Total Slots').setRequired(true))
        .addStringOption(option => 
          option.setName('mode')
            .setDescription('Mode')
            .setRequired(true)
            .addChoices(
              { name: 'Solo', value: 'Solo' },
              { name: 'Duo', value: 'Duo' },
              { name: 'Squad', value: 'Squad' }
            )
        )
        .addNumberOption(option => option.setName('entry_fee').setDescription('Entry Fee (0 for free)').setRequired(true))
        .addNumberOption(option => option.setName('prize_pool').setDescription('Total Prize Pool').setRequired(true))
        .addStringOption(option => option.setName('date').setDescription('Date (YYYY-MM-DD)').setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('Time (e.g., 18:00)').setRequired(true))
        .addStringOption(option => option.setName('check_in_time').setDescription('Check-in Time (e.g., 17:30)').setRequired(true))
        .addStringOption(option => option.setName('rules').setDescription('Rules link or text').setRequired(true))
        .addStringOption(option => option.setName('banner_image').setDescription('Banner Image URL').setRequired(false))
    ),
    
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    if (interaction.options.getSubcommand() === 'create') {
      await interaction.deferReply({ ephemeral: true });

      const name = interaction.options.getString('name', true);
      const game = interaction.options.getString('game', true);
      const totalSlots = interaction.options.getNumber('slots', true);
      const mode = interaction.options.getString('mode', true) as 'Solo' | 'Duo' | 'Squad';
      const entryFee = interaction.options.getNumber('entry_fee', true);
      const prizePool = interaction.options.getNumber('prize_pool', true);
      const dateStr = interaction.options.getString('date', true);
      const time = interaction.options.getString('time', true);
      const checkInTime = interaction.options.getString('check_in_time', true);
      const rules = interaction.options.getString('rules', true);
      const bannerImage = interaction.options.getString('banner_image') || undefined;

      try {
        const tournament = await TournamentService.createTournament({
          name,
          game,
          totalSlots,
          mode,
          entryFee,
          prizePool,
          date: new Date(dateStr),
          time,
          checkInTime,
          rules,
          bannerImage,
          status: 'Upcoming'
        });

        const embed = createSuccessEmbed('Tournament Created', `Successfully created ${name} for ${game}.`)
          .addFields([
            { name: 'Slots', value: totalSlots.toString(), inline: true },
            { name: 'Mode', value: mode, inline: true },
            { name: 'Entry Fee', value: `$${entryFee}`, inline: true },
          ]);

        if (bannerImage) embed.setImage(bannerImage);

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        await interaction.editReply({ embeds: [createErrorEmbed('Creation Failed', 'Could not create the tournament. Check logs.')] });
      }
    }
  },
};

export default command;
