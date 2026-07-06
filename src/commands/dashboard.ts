import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { Command } from '../types/Command';
import { Tournament } from '../database/models/Tournament';
import { Ticket } from '../database/models/Ticket';
import { Registration } from '../database/models/Registration';
import { createSuccessEmbed } from '../utilities/embeds';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('View the admin dashboard statistics')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    await interaction.deferReply({ ephemeral: true });

    const openTournaments = await Tournament.countDocuments({ status: 'Registration Open' }).exec();
    const totalTournaments = await Tournament.countDocuments().exec();
    
    const pendingPayments = await Registration.countDocuments({ paymentStatus: 'Pending' }).exec();
    const approvedPayments = await Registration.countDocuments({ paymentStatus: 'Approved' }).exec();
    const rejectedPayments = await Registration.countDocuments({ paymentStatus: 'Rejected' }).exec();

    const openTickets = await Ticket.countDocuments({ status: 'Open' }).exec();
    const closedTickets = await Ticket.countDocuments({ status: 'Closed' }).exec();

    const embed = createSuccessEmbed('Admin Dashboard', 'Current Statistics for the Tournament System')
      .addFields([
        { name: '🏆 Tournaments', value: `Open: ${openTournaments}\nTotal: ${totalTournaments}`, inline: true },
        { name: '💳 Payments', value: `Pending: ${pendingPayments}\nApproved: ${approvedPayments}\nRejected: ${rejectedPayments}`, inline: true },
        { name: '🎫 Tickets', value: `Open: ${openTickets}\nClosed: ${closedTickets}`, inline: true },
      ]);

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
