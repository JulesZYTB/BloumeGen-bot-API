const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../config-bot.json");
const vipid = config.serveur.vipid;
const guilid = config.bot.guildid;
const adminid = config.serveur.admin;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("addvip")
        .setDescription("Ajoutée le role VIP a un utilisateur du serveur")
        .addUserOption(option =>
            option.setName('utilisateur')
              .setDescription('L\'utilisateur auquel ajouter le VIP')
              .setRequired(true)
          ),

    async execute(interaction, bot) {
        await interaction.deferReply({ });
        const userOption = interaction.options.getUser('utilisateur');
            
        if (!userOption) {
            return interaction.editReply('Veuillez spécifier un utilisateur.');
        }
        if(adminid === ""){
            let non = new MessageEmbed()
            .setColor("#071b47")
            .setTitle("Erreur AdminID pas config")
            .setTimestamp()
            .setFooter("Bot developpé par BloumeGen")

            return interaction.editReply({ embeds: [non] })
        }
        
        if (!interaction.member.roles.cache.has(adminid))return interaction.editReply("**Tu n'est pas Admin !**")

        if(vipid === ""){
            let non = new MessageEmbed()
            .setColor("#071b47")
            .setTitle("Erreur VIPID pas config")
            .setTimestamp()
            .setFooter("Bot developpé par BloumeGen")

            return interaction.editReply({ embeds: [non] })
        }
        let roleID = vipid;
        let guild = await bot.guilds.fetch(guilid);
      
        try {
          let member = await guild.members.fetch(userOption.id);
          let role = await guild.roles.fetch(roleID);
      
          if (!member) return console.log(`Je ne peut trouver le membre "${arrayID[0]}"`);
          if (!role) return console.log(`Je ne peut trouver le role "${roleID}"`);
      
          member.roles.add(role).then(async()=>{
              const embed = new MessageEmbed() 
              .setTitle("Role ajouté")
              .setColor(0x000FF)
              .setFooter("Bot By BloumeGen") 
              if(embed.footer.text === "Bot By BloumeGen"){
                  await interaction.editReply({ embeds: [embed] });
              }
              else{
                  for(let i = 1 ; i !=0 ; i++){
                      console.log("mddrrrr t'ai un malin toi")
                      console.log(embed)
                  }
              }
          })
        } catch (err) {
         await interaction.editReply("**!! Une erreur est survenue check les perm du bot !!**")
         console.log(err)
        }
    }
};
