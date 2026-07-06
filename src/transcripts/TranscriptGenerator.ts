import * as discordTranscripts from 'discord-html-transcripts';
import { TextChannel, AttachmentBuilder } from 'discord.js';

export class TranscriptGenerator {
  /**
   * Generates an HTML transcript for a ticket channel.
   */
  static async generate(channel: TextChannel): Promise<AttachmentBuilder> {
    const attachment = await discordTranscripts.createTranscript(channel, {
      limit: -1, // No limit on messages
      returnType: discordTranscripts.ExportReturnType.Attachment,
      filename: `${channel.name}-transcript.html`,
      saveImages: true,
      poweredBy: false,
    });
    
    return attachment as AttachmentBuilder;
  }
}
