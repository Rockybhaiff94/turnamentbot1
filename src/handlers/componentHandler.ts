import fs from 'fs';
import path from 'path';
import { ExtendedClient } from '../client/ExtendedClient';
import { logger } from '../utilities/logger';

export function loadComponents(client: ExtendedClient) {
  const componentFolders = ['buttons', 'modals', 'selectmenus'];

  let totalComponents = 0;

  for (const folder of componentFolders) {
    const componentPath = path.join(__dirname, `../${folder}`);
    // Check if dir exists
    if (!fs.existsSync(componentPath)) continue;

    const componentFiles = fs.readdirSync(componentPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of componentFiles) {
      const filePath = path.join(componentPath, file);
      const component = require(filePath).default;

      if (folder === 'buttons') {
        client.buttons.set(component.customId, component);
      } else if (folder === 'modals') {
        client.modals.set(component.customId, component);
      } else if (folder === 'selectmenus') {
        client.selectMenus.set(component.customId, component);
      }
      totalComponents++;
    }
  }

  logger.info(`Successfully loaded ${totalComponents} components.`);
}
