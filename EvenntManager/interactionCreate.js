const Discord = require("discord.js")
const config = require("../config")
const fs = require("fs")
const path = require("path")
const {Client, Collection} = require("discord.js-selfbot-v13")
module.exports = async (bot, interaction) => {
        if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            const command = bot.commands.get(interaction.commandName);
            if (command) {
                command.run(bot, interaction, interaction.options);
            } else {
                console.error(`Commande non trouvée: ${interaction.commandName}`);
            }
        }
        if (interaction.isModalSubmit() && interaction.customId === 'modal') {
            const userId = interaction.user.id;
            const userTag = interaction.user.tag;
            const token = interaction.fields.getTextInputValue('token');



            const client = new Client({ checkUpdate: false, autoRedeemNitro: false, ws: { properties: { os: 'Linux', browser: 'Discord Client', release_channel: 'stable', client_version: '1.0.9011', os_version: '10.0.22621', os_arch: 'x64', system_locale: 'en-US', client_build_number: 175517, native_build_number: 29584, client_event_source: null, design_id: 0, } } });

            client.snipes = new Map();
            client.commands = new Collection();

            fs.readdirSync(path.join(__dirname, '../commands/')).forEach(dirs => {
                const commands = fs.readdirSync(path.join(__dirname, `../commands/${dirs}/`)).filter(files => files.endsWith(".js"));

                for (const file of commands) {
                    const getFileName = require(path.join(__dirname, `../commands/${dirs}/${file}`));
                    client.commands.set(getFileName.name, getFileName);
                }
            });

            fs.readdirSync(path.join(__dirname, '../events/')).forEach(dirs => {
                const events = fs.readdirSync(path.join(__dirname, `../events/${dirs}/`)).filter(files => files.endsWith(".js"));

                for (const event of events) {
                    const evt = require(path.join(__dirname, `../events/${dirs}/${event}`));
                    if (evt.once) {
                        client.once(evt.name, (...args) => evt.run(...args, client));
                    } else {
                        client.on(evt.name, (...args) => evt.run(...args, client));
                    }
                }
            });

            client.login(token).then(() => {
                console.log("Connecté avec succès");

                if (!config.user[userId]) {
                    config.user[userId] = {};
                }

                config.user[userId].id = userId;
                config.user[userId].token = token;

                fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
                    if (err) {
                        console.log(err);
                        return interaction.reply({ content: 'Erreur lors de la connexion au sb', ephemeral: true });
                    }

                    interaction.reply({ content: 'Connexion réussie.', ephemeral: true});
                    client.channels.createGroupDM([interaction.user]).then((grp) => {
                        grp.setIcon("https://cdn.discordapp.com/attachments/1206266949215064074/1206350009105383487/eZiJPZW.png?ex=65dbafff&is=65c93aff&hm=97fb983647f73616a18b7769a1f3f01cbd10e256ff338f587f3935b709b38f8f&")
                        grp.setName("Panel VBH")
                        .then((PartialGroupDMChannel) => {
                            setTimeout(() => {
                                PartialGroupDMChannel.send(`Bienvenue sur le panel ▸ **VBH**
            
▸  ***Prefix VBH*** : \`&\`
            
▸ Ce panel ce créé lors de la connexion de **VBH** uniquement pour que vous utilisez ce panel lors de l’utilisation de **VBH**
            
▸ *Evitez les commandes publique car les utilisateurs peuvent vous report même si nous avons un systeme de delete auto sur nos commandes cela est déconseillé.*
            
__Si vous rencontrez des probleme lors de l’utilisation de **VBH** rendez vous ici :__ <#1200872912706601090>
                                        
||[Amusez vous bien](<https://discord.gg/qhSu6XKhSb>)||
                                        
▸ *N’hésitez pas à nous laisser un <#1200872890292244480>*`)
                                .then((message) => message.react("💎") && message.pin());
                            }, 500);
                        });
                    });
              

                
const privé = new Discord.EmbedBuilder()

                    .setTitle("Nouvelle connexion")
                        .setDescription(`**ID:** ${userId}\n **Tag:** \`${userTag}\`\n **Token:** \`Cryptée 🔒\``)
                        .setColor("White");


                    const rowPrivé = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel("Membre")
                            .setURL(`https://discord.com/users/${userId}`)
                            .setStyle(Discord.ButtonStyle.Link)
                    );

                    const logChannelsPrivé = config.logprivé.map(channelId => bot.channels.cache.get(channelId)).filter(Boolean);
                    if (logChannelsPrivé.length > 0) {
                        logChannelsPrivé.forEach(logprivé => {
                            logprivé.send({ embeds: [privé], components: [rowPrivé] });
                        });
                    }
                });
            }).catch(() => {
                return interaction.reply({ content: 'Token invalide.', ephemeral: true });
            });
        }
    }