import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, AutocompleteInteraction } from 'discord.js';
import { ExtendedClient } from '../client/ExtendedClient';

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: ChatInputCommandInteraction, client: ExtendedClient) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction, client: ExtendedClient) => Promise<void>;
}
