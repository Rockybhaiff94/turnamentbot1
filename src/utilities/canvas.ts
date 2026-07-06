import { createCanvas, loadImage } from 'canvas';
import { IUser } from '../database/models/User';

export class CanvasUtility {
  /**
   * Generates a player profile image.
   */
  static async generateProfileCard(user: IUser, avatarUrl: string, username: string): Promise<Buffer> {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#1e1e24';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw avatar
    try {
      const avatar = await loadImage(avatarUrl);
      ctx.save();
      ctx.beginPath();
      ctx.arc(100, 100, 60, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 40, 40, 120, 120);
      ctx.restore();
    } catch (e) {
      // Fallback if avatar fails to load
      ctx.fillStyle = '#5865F2';
      ctx.beginPath();
      ctx.arc(100, 100, 60, 0, Math.PI * 2, true);
      ctx.fill();
    }

    // Text styling
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(username, 180, 90);

    ctx.fillStyle = '#AAAAAA';
    ctx.font = '24px sans-serif';
    ctx.fillText(`IGN: ${user.ign || 'N/A'}`, 180, 130);
    ctx.fillText(`UID: ${user.uid || 'N/A'}`, 180, 160);

    // Stats
    ctx.fillStyle = '#57F287';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`Wins: ${user.wins}`, 50, 250);
    ctx.fillText(`Kills: ${user.kills}`, 250, 250);
    
    ctx.fillStyle = '#FEE75C';
    ctx.fillText(`Earnings: $${user.earnings}`, 450, 250);

    const totalMatches = user.wins + 0; // Update with real match count logic later
    const winRate = totalMatches > 0 ? ((user.wins / totalMatches) * 100).toFixed(2) : 0;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px sans-serif';
    ctx.fillText(`Win Rate: ${winRate}%`, 50, 300);

    return canvas.toBuffer();
  }
}
