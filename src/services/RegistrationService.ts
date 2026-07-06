import { Registration, IRegistration, PaymentStatus } from '../database/models/Registration';
import { logger } from '../utilities/logger';

export class RegistrationService {
  /**
   * Creates a new registration.
   */
  static async createRegistration(data: Partial<IRegistration>): Promise<IRegistration> {
    try {
      const registration = new Registration(data);
      await registration.save();
      return registration;
    } catch (error) {
      logger.error(`Error creating registration: ${error}`);
      throw error;
    }
  }

  /**
   * Updates payment status.
   */
  static async updatePaymentStatus(registrationId: string, status: PaymentStatus): Promise<IRegistration | null> {
    return Registration.findOneAndUpdate(
      { registrationId }, 
      { paymentStatus: status }, 
      { new: true }
    ).exec();
  }

  /**
   * Checks if user has already registered.
   */
  static async isUserRegistered(userId: string, tournamentId: string): Promise<boolean> {
    const count = await Registration.countDocuments({ userId, tournamentId }).exec();
    return count > 0;
  }
}
