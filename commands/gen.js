const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const axios = require('axios');
const config = require("../config-bot.json");

let apikey = config.apikey;
// Fonction pour récupérer les choix depuis l'API
const getServiceByName = async (apikey, serviceName) => {
    try {
        const response = await axios.get(`https://api.bloume-gen.tk/api?APIKey=${apikey}&id=ALL&mode=SERVICEALL`);
        if (response && response.data && response.data.services && Array.isArray(response.data.services)) {
            const services = response.data.services;
            const foundService = services.find(service => service.nom.toLowerCase() === serviceName.toLowerCase());
            return foundService;
        } else {
            console.error("Erreur : le tableau de services n'est pas correctement défini dans la réponse de l'API.");
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des services :', error);
        return null;
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gen")
        .setDescription("Générer un service")
        .addStringOption(options => 
            options.setName("service")
              .setDescription("Mettre le nom du service que vous souhaitez")
              .setRequired(true)
          ),

    async execute(interaction, bot) {
        await interaction.deferReply({ });
        const userid = interaction.user.id;
        const servicen = interaction.options
         .getString("service")
         .toLowerCase()
         .trim();
            const serviceName = servicen;

            if (!serviceName) {
                return interaction.editReply('Veuillez fournir le nom du service que vous souhaitez rechercher.');
            }
    
            // Recherche le service par son nom
            const foundService = await getServiceByName(apikey, serviceName);
    
            if (!foundService) {
                interaction.editReply(`Aucun service trouvé avec le nom "${serviceName}".`);
            } else {
                

            try {
                const response = await axios.get(`https://api.bloume-gen.tk/api?APIKey=${apikey}&id=${foundService.id}&mode=GEN`);
                if(response.data.erreur === 'APIKey invalide'){
                    let non = new MessageEmbed()
                .setColor("#071b47")
                .setTitle("Erreur APIKey Invalid")
                .setTimestamp()
                .setFooter("Bot developpé par BloumeGen")
    
                return interaction.editReply({ embeds: [non] })
                }
                if(response.data.erreur === 'Id du service invalide'){
                    let non = new MessageEmbed()
                .setColor("#071b47")
                .setTitle("Erreur Id du service Invalid (service invalid)")
                .setTimestamp()
                .setFooter("Bot developpé par BloumeGen")
    
                return interaction.editReply({ embeds: [non] })
                }
                if(response.data.erreur === 'stock off'){
                    let non = new MessageEmbed()
                .setColor("#071b47")
                .setTitle("Hors Stock")
                .setTimestamp()
                .setFooter("Bot developpé par BloumeGen")
    
                return interaction.editReply({ embeds: [non] })
                }
                if(response.data.erreur === 'limite gen'){
                    let non = new MessageEmbed()
                .setColor("#071b47")
                .setTitle("La limite de générations pour aujourd'hui a été dépassée (Votre API Key a une limite de 100 générations par jour).")
                .setTimestamp()
                .setFooter("Bot developpé par BloumeGen")
    
                return interaction.editReply({ embeds: [non] })
                }
                const servicename = response.data.message;
                const comptes = response.data.compte;
                const nextUser = await bot.users.fetch(userid);
                        
                const dmChannel = await nextUser.createDM();
                const mp = new MessageEmbed()
                .setColor(0x000FF)
                .setTitle(`${servicename}`)
                .addField('Email/Mdp', `\`\`\`${comptes}\`\`\``)
                .addField('Sponsor', `[Click ici](https://manager.bloumegen.vip/)`)
                .addField('CREDIT', `Bot By BloumeGen`)
                .setTimestamp()
                await dmChannel.send({ embeds: [mp] }).then(dmChannel.send('copié-collé:')).then(dmChannel.send(`\`${comptes}\``));
                const good = new MessageEmbed()
                .setColor(0x000FF)
                .setTitle('Service Génèrer ☑️')
                .setDescription(`Regarde dans tes mp ${interaction.author}! *si t'as pas recu les massages unlock tes dm stp*`)
                .addField('Sponsor', `[Click ici](https://manager.bloumegen.vip/)`)
                .addField('CREDIT', `Bot By BloumeGen`)
                .setTimestamp()
                await interaction.editReply({ embeds: [good] })
            
        } catch (error) {
                console.error('Erreur lors de la récupération des stocks :', error);
            }
        }
        
    }
};

