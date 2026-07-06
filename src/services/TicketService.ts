import { Ticket } from '../database/models/Ticket';
import { logger } from '../utilities/logger';

export class TicketService {
  /**
   * Generates a unique registration ID.
   * Format: REG-YYYY-000001
   */
  static generateRegistrationId(count: number): string {
    const year = new Date().getFullYear();
    const paddedCount = count.toString().padStart(6, '0');
    return `REG-${year}-${paddedCount}`;
  }

  /**
   * Creates a new ticket record.
   */
  static async createTicket(channelId: string, userId: string, ticketId: string, tournamentId?: string) {
    try {
      const ticket = new Ticket({
        ticketId,
        channelId,
        userId,
        tournamentId,
        status: 'Open'
      });
      await ticket.save();
      return ticket;
    } catch (error) {
      logger.error(`Error creating ticket: ${error}`);
      throw error;
    }
  }

  /**
   * Closes a ticket.
   */
  static async closeTicket(channelId: string, transcriptUrl?: string) {
    return Ticket.findOneAndUpdate(
      { channelId },
      { status: 'Closed', transcriptUrl },
      { new: true }
    ).exec();
  }
}
