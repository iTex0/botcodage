const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = "!" 

const fs = require('fs');

client.login("NTUxODA0Nzc4MDU4MDg4NDUx.D12T-w.GJ2ok-CwMJ5dpJscjVYqZD-T_NM");

client.commands = new Discord.Collection();

fs.readdir('./Commandes', (err, files) => {
    if (err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }
    console.log('- -')
    jsfile.forEach((f, i) => {
        let props = require(`./Commandes/${f}`);
        console.log(`[Commandes | Others] ${f} chargé !`);
        client.commands.set(props.help.name, props);
    });
});

client.on("message", (message) => {
    if (message.author.bot || message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if (!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length));

    if (commandfile) {
        commandfile.run(client, message, args);

    } else {
        //message.channel.send("Aïe.. Cette commande n'existe pas").then(me => me.delete(7000));

    }
});

// fs.readdir("./Commandes/", (error, f) => {
//     if(error) console.log(error);

//     let commandes = f.filter(f => f.split(".").pop() === 'js');
//     if(commandes.length <= 0) return console.log("Aucune commande trouvée !");
    
//     commandes.forEach((f) => {

//         let commande = require(`./Commandes/${f}`);
//         console.log(`${f} commande chargée !`);

//     client.commands.set(commande.help.name, commande);
//     });
// });

// fs.readdir("./Events/", (error, f) => {
//     if(error) console.log(error);
//     console.log(`${f.length} events en chargement`);

//     f.forEach((f) => {
//         const events = require(`./Events/${f}`);
//         const event = f.split(".")[0];
    
//     client.on(event, events.bind(null, client));    
//     });
// });

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
   
    if (args[0].toLocaleLowerCase() === prefix + '8ball'){
        if (!args[0]) return message.channel.send("Veuillez **poser une question** :x:")
        let rep = ["Non :x:", "J'ai envie de dormir :zzz:", "Balec :face_palm:", "Peut être... :thinking:", "Absolument :interrobang:"];
        let reptaille = Math.floor((Math.random() * rep.length));
        let question = args.slice(0).join(" ");
 
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag)
            .setColor("ORANGE")
            .addField("Question:", question)
            .addField("Réponse:", rep[reptaille]);
        message.channel.send(embed)
    }
})
 
const warns = JSON.parse(fs.readFileSync('./warns.json'))
 
client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + "warn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre")
        if (member.highestRole.comparePositionTo(message.member.highestRole) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre")
        let reason = args.slice(2).join(' ')
        if (!reason) return message.channel.send("Veuillez indiquer une raison")
        if (!warns[member.id]) {
            warns[member.id] = []
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:")
    }
 
    if (args[0].toLowerCase() === prefix + "infractions") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre")
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField('10 derniers warns', ((warns[member.id]) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warns"))
            .setTimestamp()
        message.channel.send(embed)
    }
})


client.on('message', message =>{
    if(message.content === "tu fais quoi?"){
        message.reply('Je mange des pâtes dans ma pastabox ! :heart:');
        console.log('répond à tfq');
    }
});


client.on('guildMemberAdd', member =>{
    member.guild.channels.get('509720961042350081').send(':tada: **Bienvenue**' + member.user + ':smile: Nous Sommes | ' + member.guild.memberCount);
    console.log('+1')
})

client.on('guildMemberRemove', member =>{
    member.guild.channels.get('509720961042350081').send(':tada: **Aurevoir**' + member.user + ':smile: Nous Sommes | ' + member.guild.memberCount);
    console.log('+1')
})
