import { Room, IRoom } from '../database/models/Room';
import { logger } from '../utilities/logger';

export class RoomService {
  /**
   * Creates a new room.
   */
  static async createRoom(data: Partial<IRoom>): Promise<IRoom> {
    try {
      const room = new Room(data);
      await room.save();
      return room;
    } catch (error) {
      logger.error(`Error creating room: ${error}`);
      throw error;
    }
  }

  /**
   * Updates players who have received the room details.
   */
  static async addSentToUsers(roomId: string, userIds: string[]) {
    return Room.findByIdAndUpdate(
      roomId,
      { $addToSet: { sentTo: { $each: userIds } } },
      { new: true }
    ).exec();
  }
}
