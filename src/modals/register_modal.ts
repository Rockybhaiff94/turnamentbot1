import { ModalSubmitInteraction, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { TournamentService } from '../services/TournamentService';
import { RegistrationService } from '../services/RegistrationService';
import { TicketService } from '../services/TicketService';
import { createSuccessEmbed, createErrorEmbed } from '../utilities/embeds';
import { config } from '../config';

export default {
  customId: 'register_modal_',
  async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
    await interaction.deferReply({ ephemeral: true });

    const tournamentId = interaction.customId.split('_').pop();
    if (!tournamentId) return;

    const tournament = await TournamentService.getTournamentById(tournamentId);
    if (!tournament) return interaction.editReply({ embeds: [createErrorEmbed('Error', 'Tournament not found.')] });

    const ign = interaction.fields.getTextInputValue('ign');
    const uid = interaction.fields.getTextInputValue('uid');
    const teamName = interaction.fields.getTextInputValue('team_name');
    const captainName = interaction.fields.getTextInputValue('captain_name');
    let notes = '';
    try {
      notes = interaction.fields.getTextInputValue('notes');
    } catch {} // Optional field

    // Check if user is already registered to avoid duplicates right before saving
    const isRegistered = await RegistrationService.isUserRegistered(interaction.user.id, tournamentId);
    if (isRegistered) {
      return interaction.editReply({ embeds: [createErrorEmbed('Error', 'You have already registered.')] });
    }

    // 1. Generate Registration ID
    const regCount = await require('../database/models/Registration').Registration.countDocuments().exec();
    const regId = TicketService.generateRegistrationId(regCount + 1);

    // 2. Create Private Ticket Channel
    const guild = interaction.guild;
    if (!guild) return;

    try {
      const overwrites: any[] = [
        {
          id: guild.id,
          deny: ['ViewChannel'],
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages', 'AttachFiles', 'ReadMessageHistory'],
        },
      ];

      if (config.roles.staff) {
        overwrites.push({
          id: config.roles.staff,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
        });
      }

      const ticketChannel = await guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: config.channels.ticketCategory || undefined,
        permissionOverwrites: overwrites,
      });

      // 3. Save Registration and Ticket to DB
      await RegistrationService.createRegistration({
        registrationId: regId,
        userId: interaction.user.id,
        tournamentId: tournament._id as any,
        ign,
        uid,
        teamName,
        captainName,
        notes,
        paymentStatus: 'Pending'
      });

      await TicketService.createTicket(ticketChannel.id, interaction.user.id, regId, tournament._id.toString());

      // 4. Send instructions in the new ticket channel
      const ticketEmbed = createSuccessEmbed('Registration Pending', `Welcome ${interaction.user}! Please review your details and proceed with the payment to secure your slot.`)
        .addFields([
          { name: 'Tournament', value: tournament.name, inline: true },
          { name: 'Entry Fee', value: `$${tournament.entryFee}`, inline: true },
          { name: 'Registration ID', value: regId, inline: true },
          { name: 'IGN', value: ign, inline: true },
          { name: 'UID', value: uid, inline: true },
          { name: 'Team', value: teamName, inline: true },
        ])
        .setDescription(`Please pay the entry fee using the provided instructions, then click the button below to upload your payment screenshot.
        
**Payment Instructions:**
Send $${tournament.entryFee} to the official UPI/QR code.
        `);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`upload_payment_${regId}`).setLabel('Upload Payment Screenshot').setStyle(ButtonStyle.Primary)
      );

      await ticketChannel.send({ content: `<@${interaction.user.id}>`, embeds: [ticketEmbed], components: [row] });

      await interaction.editReply({ 
        embeds: [createSuccessEmbed('Ticket Created', `Your registration ticket has been created at <#${ticketChannel.id}>. Please proceed there.`)] 
      });

    } catch (error) {
      console.error(error);
      await interaction.editReply({ embeds: [createErrorEmbed('System Error', 'Failed to create the ticket channel. Please contact support.')] });
    }
  }
};
