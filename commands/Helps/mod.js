// command to get profile picture
const Discord = require("discord.js-selfbot-v13");
const { language } = require("../../fonctions");
const config = require("../../config.json");

module.exports = {
  name: "mod",
  description: "Menu Mod",
  run: async (client, message, args, db, prefix) => {
    const customName = config.customName;
      message.edit(
      await language(
        client,
        `⛧ __**${customName} - Modération**__ ⛧
\`${prefix}kickbots\` ➜ **Expulse tout les bots du serveur**
\`${prefix}clearperms\` ➜ **Désactive la totalité des permissions dangereuse présente sur le serveur (rôles, administrateur)**
\`${prefix}renew\` ➜ **Recréé le salon demandé (utilisable uniquement sur un serveur)**`,
        `⛧ __**${customName} - Moderation**__ ⛧
\`${prefix}kickbots\` ➜ **Kick all bots from the guild**
\`${prefix}clearperms\` ➜ **Disable all dangerous permissions on the server (roles, administrator)**
\`${prefix}renew\` ➜ **Recreate a channel (usable in guild only)**`
      )
    );
  },
};
