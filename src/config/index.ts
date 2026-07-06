import dotenv from 'dotenv';
dotenv.config();

export const config = {
  bot: {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.CLIENT_ID || '',
    guildId: process.env.GUILD_ID || '', 
  },
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/topturnament',
  },
  api: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
  roles: {
    admin: process.env.ADMIN_ROLE_ID || '',
    staff: process.env.STAFF_ROLE_ID || '',
    registered: process.env.REGISTERED_ROLE_ID || '',
  },
  channels: {
    logChannel: process.env.LOG_CHANNEL_ID || '',
    ticketCategory: process.env.TICKET_CATEGORY_ID || '',
    transcriptChannel: process.env.TRANSCRIPT_CHANNEL_ID || '',
  }
};
