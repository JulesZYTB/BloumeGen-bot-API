const axios = require('axios');
const readline = require('readline');
const fs = require('fs').promises;
const chalk = require("chalk");
const figlet = require('figlet');
const gradient = require('gradient-string');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (question) => {
    return new Promise((resolve) => rl.question(question, resolve));
};

const createGift = async (apiKey, time, type) => {
    const url = `https://api.bloume-gen.tk/api_cadeaux?APIKey=${apiKey}&time=${time}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.success) {
            const giftInfo = `Type: ${type}, Code: https://manager.bloumegen.vip/cadeaux?id=${data.code}\n`; 
            await fs.appendFile('cadeauxVip.txt', giftInfo); 
            console.log(chalk.green("[SUCCESS] - ") + `Cadeau créé avec succès: https://manager.bloumegen.vip/cadeaux?id=${data.code}`);
        } else {
            console.error(chalk.redBright("[ERREUR] - ") + `Erreur: ${data.erreur}`);
        }
    } catch (error) {
        console.error(chalk.redBright("[ERREUR] - ") + `Erreur lors de la requête: ${error.message}`);
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
    const texts = 'BloumeGen API';
    figlet(texts, function(err, asciiArt) {
      console.log(gradient.rainbow(asciiArt));
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const text = 'Cadeaux VIP Generateur';
    figlet(text, function(err, asciiArt) {
      console.log(gradient.rainbow(asciiArt));
      console.log(gradient.rainbow("BloumeGen API par ") + "JulesZ & BloumeGen");
      console.log(gradient.rainbow("BloumeGen API Version ") + "1.0");
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const apiKey = await askQuestion(chalk.blueBright("[INFO] - ") + 'Entrez votre APIKey: ');

    console.log(chalk.blueBright("[INFO] - ") + 'Choisissez un type de cadeau:');
    console.log('1: Small BloumeChat.com');
    console.log('2: Small Gratuit');
    console.log('3: Small');
    console.log('4: Medium');
    console.log('5: Medium+');
    console.log('6: Big Medium');

    const choice = await askQuestion(chalk.blueBright("[INFO] - ") + 'Entrez le numéro correspondant au type de cadeau: ');

    let time, type;
    switch (choice) {
        case '1':
            time = '4';
            type = 'Small BloumeChat.com';
            break;
        case '2':
            time = '2';
            type = 'Small Gratuit';
            break;
        case '3':
            time = '30';
            type = 'Small';
            break;
        case '4':
            time = '120';
            type = 'Medium';
            break;
        case '5':
            time = '365';
            type = 'Medium+';
            break;
        case '6':
            time = '100000';
            type = 'Big Medium';
            break;
        default:
            console.error(chalk.redBright("[ERREUR] - ") + 'Choix invalide');
            rl.close();
            return;
    }

    const numGifts = await askQuestion(chalk.blueBright("[INFO] - ") + 'Combien de cadeaux voulez-vous créer? ');
    const delayTime = await askQuestion(chalk.blueBright("[INFO] - ") + 'Entrez le délai entre chaque création de cadeau en secondes: ');

    for (let i = 0; i < numGifts; i++) {
        console.log(chalk.yellowBright("[WAIT] - ") + `Création du cadeau ${i + 1}...`);
        await createGift(apiKey, time, type);
        if (i < numGifts - 1) {
            console.log(chalk.yellowBright("[WAIT] - ") + `Attente de ${delayTime} secondes avant la prochaine création de cadeau...`);
            await delay(delayTime * 1000); 
        }
    }

    rl.close();
};

main();
