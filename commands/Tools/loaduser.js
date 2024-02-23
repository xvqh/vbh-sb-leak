const fs = require('fs');
const { language, savedb } = require("../../fonctions");

module.exports = {
    name: "loaduser",
    description: "Charger une backup",
    run: async (client, message, args,) => {
        try {
            if (args.length < 1) {
                return message.channel.send("Veuillez fournir l'ID de la backup.");
            }

            const backupID = args[0];

            loadBackup(backupID, message.channel, client);

        } catch (e) {
            console.error("Erreur lors de la commande de backup :", e);
            message.channel.send("Une erreur est survenue lors du chargement de la backup.");
        }
    }
};

async function loadBackup(backupID, channel, client) {
    const fileName = `backup/backup_${backupID}.json`;

    try {
        const backupData = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
        console.log("Données de la backup :", backupData);
        
        if (backupData.name) {
            await client.user.setGlobalName(backupData.name);
        }
        if (backupData.avatar) {
            await client.user.setAvatar(backupData.avatar);
        }
        if (backupData.servers && backupData.servers.length > 0) {
            for (const serverInvite of backupData.servers) {
                try {
                    const invite = await client.fetchInvite(serverInvite);
                    await invite.accept();
                } catch (error) {
                    console.error(`Erreur via l'invitation ${serverInvite} : ${error.message}`);
                }
            }
        }
        if (backupData.friends && backupData.friends.length > 0) {
            const friendsList = backupData.friends.join('\n');
            channel.send(`Liste des amis :\n${friendsList}`);
        }

        if (backupData.bio) {
            await client.user.setAboutMe(backupData.bio);
        }

        console.log(`Backup chargée avec succès à partir du fichier ${fileName}`);
        channel.send('Backup chargée avec succès !');
    } catch (error) {
        console.error(`Erreur lors du chargement de la backup à partir du fichier ${fileName} : ${error.message}`);
        channel.send('Une erreur s\'est produite lors du chargement de la backup.');
    }
}