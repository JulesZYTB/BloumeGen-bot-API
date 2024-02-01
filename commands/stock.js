const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../config-bot.json");
const axios = require('axios');
const fs = require('fs');
let apikey = config.apikey;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stock")
        .setDescription("Stock du site BloumeGen.vip"),

    async execute(interaction, bot) {
        await interaction.deferReply({ });
        try {
            const response = await axios.get(`https://api.bloume-gen.tk/api?APIKey=${apikey}&id=ALL&mode=STOCKALL`);
            if(response.data.erreur === 'APIKey invalide'){
                let non = new MessageEmbed()
            .setColor("#071b47")
            .setTitle("Erreur APIKey Invalid")
            .setTimestamp()
            .setFooter("Bot developpé par BloumeGen")

            return interaction.editReply({ embeds: [non] })
            }
            const stocks = response.data.stocks;
            const pages = createStocksPages(stocks);
            sendPage(interaction, pages, 0);
        } catch (error) {
            console.error('Erreur lors de la récupération des stocks :', error);
        }
        
        function createStocksPages(stocks) {
            const pages = [];
            const chunkedStocks = chunkArray(stocks, 25);

            for (const chunk of chunkedStocks) {
                const embed = new MessageEmbed()
                    .setTitle('Stock de tout les services - Page 1/N')
                    .setTimestamp()
                    .setColor(0x0099ff);

                for (const service of chunk) {
                    embed.addField(service.nom, `Stock: ${service.stock}`, true);
                    embed.setFooter(`Bot developpé par BloumeGen - Page 1/N`);
                }

                pages.push(embed);
            }

            return pages;
        }

        async function sendPage(interaction, pages, currentPage) {
            const embed = pages[currentPage];
            const totalPages = pages.length;

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('prev_button')
                        .setLabel('⬅️')
                        .setStyle(currentPage === 0 ? 'SECONDARY' : 'PRIMARY'),
                    new MessageButton()
                        .setCustomId('next_button')
                        .setLabel('➡️')
                        .setStyle(currentPage === totalPages - 1 ? 'SECONDARY' : 'PRIMARY')
                );

            const sentMessage = await interaction.editReply({ embeds: [embed], components: [row] });

            const filter = i => i.customId.startsWith('prev_button') || i.customId.startsWith('next_button');
            const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async interaction => {
                if (interaction.customId === 'prev_button' && currentPage > 0) {
                    currentPage--;
                } else if (interaction.customId === 'next_button' && currentPage < totalPages - 1) {
                    currentPage++;
                }

                const updatedEmbed = pages[currentPage].setFooter(`Bot developpé par BloumeGen - Page ${currentPage + 1}/${totalPages}`).setTimestamp().setTitle(`Stock de tout les services - Page ${currentPage + 1}/${totalPages}`);

                await interaction.update({ embeds: [updatedEmbed], components: [row] });
            });

            collector.on('end', async (_, reason) => {
                if (reason === 'time') {
                    await sentMessage.edit({ components: [] });
                }
            });
        }

        function chunkArray(array, size) {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
                const chunk = array.slice(i, i + size);
                result.push(chunk);
            }
            return result;
        }
    }
};
