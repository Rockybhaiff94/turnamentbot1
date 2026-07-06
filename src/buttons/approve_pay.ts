import { ButtonInteraction } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { Registration } from '../database/models/Registration';
import { createSuccessEmbed, createErrorEmbed } from '../utilities/embeds';

export default {
  customId: 'approve_pay_',
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    await interaction.deferReply({ ephemeral: false });

    const registrationId = interaction.customId.split('approve_pay_')[1];
    const registration = await Registration.findOne({ registrationId }).exec();

    if (!registration) {
      return interaction.editReply({ embeds: [createErrorEmbed('Error', 'Registration not found.')] });
    }

    if (registration.paymentStatus === 'Approved') {
      return interaction.editReply({ embeds: [createErrorEmbed('Already Approved', 'This payment has already been approved.')] });
    }

    registration.paymentStatus = 'Approved';
    await registration.save();

    await interaction.editReply({ embeds: [createSuccessEmbed('Payment Approved', `Registration ${registrationId} has been fully approved by staff.`)] });

    // Try to DM the user
    try {
      const user = await client.users.fetch(registration.userId);
      await user.send({ embeds: [createSuccessEmbed('Registration Complete', `Your payment for registration **${registrationId}** has been approved! You are successfully registered for the tournament.`)] });
    } catch (e) {
      // Ignored
    }

    // Disable the button row (optional logic, but basic implementation done)
  }
};
