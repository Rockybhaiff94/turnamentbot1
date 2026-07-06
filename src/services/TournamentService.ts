import { Tournament, ITournament, TournamentMode } from '../database/models/Tournament';
import { logger } from '../utilities/logger';

export class TournamentService {
  /**
   * Creates a new tournament.
   */
  static async createTournament(data: Partial<ITournament>): Promise<ITournament> {
    try {
      const tournament = new Tournament(data);
      await tournament.save();
      return tournament;
    } catch (error) {
      logger.error(`Error creating tournament: ${error}`);
      throw error;
    }
  }

  /**
   * Gets an active tournament by ID.
   */
  static async getTournamentById(id: string): Promise<ITournament | null> {
    return Tournament.findById(id).exec();
  }

  /**
   * Gets a list of upcoming or open tournaments.
   */
  static async getActiveTournaments(): Promise<ITournament[]> {
    return Tournament.find({ 
      status: { $in: ['Upcoming', 'Registration Open', 'Live'] } 
    }).exec();
  }

  /**
   * Updates tournament status.
   */
  static async updateStatus(id: string, status: string): Promise<ITournament | null> {
    return Tournament.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }
}
