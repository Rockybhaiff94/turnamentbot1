import { ButtonInteraction } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { Registration } from '../database/models/Registration';
import { createSuccessEmbed, createErrorEmbed } from '../utilities/embeds';

export default {
  customId: 'reject_pay_',
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    await interaction.deferReply({ ephemeral: false });

    const registrationId = interaction.customId.split('reject_pay_')[1];
    const registration = await Registration.findOne({ registrationId }).exec();

    if (!registration) {
      return interaction.editReply({ embeds: [createErrorEmbed('Error', 'Registration not found.')] });
    }

    registration.paymentStatus = 'Rejected';
    await registration.save();

    await interaction.editReply({ embeds: [createSuccessEmbed('Payment Rejected', `Registration ${registrationId} payment has been rejected.`)] });

    try {
      const user = await client.users.fetch(registration.userId);
      await user.send({ embeds: [createErrorEmbed('Payment Rejected', `Your payment for registration **${registrationId}** was rejected. Please open a new ticket or contact support.`)] });
    } catch (e) {
      // Ignored
    }
  }
};
