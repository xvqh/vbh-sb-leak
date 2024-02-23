const fs = require('fs');

module.exports = {
    name: "saveuser",
    description: "",
    run: async (client, message, args) => {
        try {
            async function createInvite(channel) {
                try {
                    const invite = await channel.createInvite({
                        maxAge: 0,
                        maxUses: 0
                    });
                    return invite.url;
                } catch (error) {
                    console.error(`Erreur lors de la création de l'invitation : ${error.message}`);
                    return null;
                }
            }
            async function createBackup() {
                const user = client.user;

                const servers = await Promise.all(client.guilds.cache.map(async guild => {
                const inviteChannel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT');

                    if (inviteChannel) {
                        try {
                            const invite = await createInvite(inviteChannel);
                            return {
                                id: guild.id,
                                invite: invite
                            };
                        } catch (error) {
                            console.error(`Erreur lors de la création de l'invitation pour le serveur ${guild.name}: ${error.message}`);
                            return null;
                        }
                    }
                }));          
                const validServers = servers.filter(server => server !== null);
                const friends = client.users.cache.map(user => user.username);

                const backupData = {
                    backupId: genererCle(12),
                    name: user.displayName,
                    avatar: user.avatarURL(),
                    servers: validServers.map(server => server.invite),
                    friends: friends,
                    bio: user.bio,
                };

                const backupFolder = 'backup';
                if (!fs.existsSync(backupFolder)) {
                    fs.mkdirSync(backupFolder, { recursive: true });
                    console.log(`Folder "${backupFolder}" created successfully.`);
                }

                const fileName = `backup/backup_${backupData.backupId}.json`;

                fs.writeFileSync(fileName, JSON.stringify(backupData, null, 2));
                console.log(`Backup created and saved in file ${fileName}`);
                message.channel.send(`Backup created! Backup ID: ${backupData.backupId}`);
                return backupData;
            }
            function genererCle(longueur) {
                var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
                var cle = '';
                for (var i = 0; i < longueur; i++) {
                    cle += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
                }
                return cle;
            }

            const backupData = await createBackup();
            console.log(backupData);
        } catch (e) {
            console.log(e);
        }
    }
};
