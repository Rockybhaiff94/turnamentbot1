import { Events, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';
import { Ticket } from '../database/models/Ticket';
import { Registration } from '../database/models/Registration';
import { createWarningEmbed } from '../utilities/embeds';

export default {
  name: Events.MessageCreate,
  async execute(message: Message, client: ExtendedClient) {
    if (message.author.bot) return;

    // Check if the message is in a ticket channel and contains an image
    if (message.channel.isTextBased() && ('name' in message.channel) && message.channel.name && message.channel.name.startsWith('ticket-')) {
      const attachment = message.attachments.first();
      
      if (attachment && attachment.contentType?.startsWith('image/')) {
        const ticket = await Ticket.findOne({ channelId: message.channel.id, status: 'Open' }).exec();
        
        if (ticket && ticket.tournamentId) {
          const registration = await Registration.findOne({ registrationId: ticket.ticketId }).exec();
          
          if (registration && registration.paymentStatus === 'Pending') {
            // Update the registration with screenshot URL
            registration.screenshotUrl = attachment.url;
            await registration.save();

            const row = new ActionRowBuilder<ButtonBuilder>()
              .addComponents(
                new ButtonBuilder().setCustomId(`approve_pay_${registration.registrationId}`).setLabel('Approve').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId(`reject_pay_${registration.registrationId}`).setLabel('Reject').setStyle(ButtonStyle.Danger),
              );

            const embed = createWarningEmbed('Payment Review', 'A payment screenshot has been uploaded. Staff, please review and approve or reject.')
              .setImage(attachment.url);

            if ('send' in message.channel && typeof message.channel.send === 'function') {
              await message.channel.send({ embeds: [embed], components: [row] });
            }
          }
        }
      }
    }
  },
};
