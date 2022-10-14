const router = require('express').Router();
const Infractions = require('../models/Infraction')
const { EmbedBuilder } = require('discord.js')
const noblox = require('noblox.js')
require('dotenv').config()

const hasPerms = () => {
    return async (req, res, authorise) => {
        if(!req.user) return res.status(401).send('Unauthorized request.')
        let member = await discordClient.guilds.cache.get(process.env.GUILD_ID).members.fetch(req.user.discordId)
        if(!member) return res.status(401).send('Not a moderator.')
        if(member.roles.cache.has(process.env.REQUIRED_PANEL_ACCESS_ROLE_ID)) {
            return authorise()
        } else return res.status(401).send('Not a moderator.')
    }
};

router.get('/all', hasPerms(), async (req, res) => {
    let data = await Infractions.findAll({raw: true})
    return res.status(200).json(data.reverse())
})

router.get("/delete", hasPerms(), async (req, res) => {
    if(!req.query.id) return res.sendStatus(400)
    let infraction = await Infractions.findOne({where: {id: req.query.id}}).catch((err) => res.sendStatus(400))
    if(infraction === null) return res.sendStatus(400)
    await infraction.destroy().catch((err) => {return res.sendStatus(500)})
    if(process.env.LOGGING) {
        let channel = await discordClient.channels.cache.get(process.env.LOGGING_CHANNEL_ID)
        if(channel) {
            await channel.send({embeds: [
                new EmbedBuilder()
                .setTitle('Infraction Deleted')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`)
                .setDescription(`${req.user.username} has deleted infraction #${infraction.id}.\n\n**Infraction Details**`)
                .addFields(
                    {name: 'Details', value: `Type: \`${infraction.type}\`\nReason: \`${infraction.reason}\`\nNotes: \`${infraction.notes}\`\nDate: <t:${Math.trunc(new Date(infraction.date).getTime() / 1000)}>`, inline: true},{name: 'Suspect', value: `[${JSON.parse(infraction.suspect).name}](https://roblox.com/users/${JSON.parse(infraction.suspect).id})`, inline: true},{name: 'Moderator', value: `<@${JSON.parse(infraction.moderator).id}>`, inline: true}
                )
                .setColor('Red')
            ]})
        }
    }
    return res.sendStatus(200);
})

router.get("/edit/ban", hasPerms(), async (req, res) => {
    if(!req.query.id) return res.sendStatus(400)
    let infraction = await Infractions.findOne({where: {id: req.query.id}}).catch((err) => res.sendStatus(400))
    if(infraction === null) return res.sendStatus(400)
    await infraction.update({type: 'Ban'}).catch((err) => {return res.sendStatus(500)})
    if(process.env.LOGGING) {
        let channel = await discordClient.channels.cache.get(process.env.LOGGING_CHANNEL_ID)
        if(channel) {
            await channel.send({embeds: [
                new EmbedBuilder()
                .setTitle('Ban Bolo Resolved')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`)
                .setDescription(`${req.user.username} has resolved ban bolo/infraction #${infraction.id}.\n\n**Infraction Details**`)
                .addFields(
                    {name: 'Details', value: `Type: \`${infraction.type}\`\nReason: \`${infraction.reason}\`\nNotes: \`${infraction.notes}\`\nDate: <t:${Math.trunc(new Date(infraction.date).getTime() / 1000)}>`, inline: true},{name: 'Suspect', value: `[${JSON.parse(infraction.suspect).name}](https://roblox.com/users/${JSON.parse(infraction.suspect).id})`, inline: true},{name: 'Moderator', value: `<@${JSON.parse(infraction.moderator).id}>`, inline: true}
                )
                .setColor('Green')
            ]})
        }
    }
    return res.sendStatus(200);
})

router.post("/create", hasPerms(),async (req, res) => {
    let playerData = {id: req.body.infractionData.user, thumbnail: '', username: '', infractions: []}
    let infractionData = req.body.infractionData;
    if(!infractionData || !infractionData.user || !infractionData.type || !infractionData.reason || !infractionData.note) return res.sendStatus(400);

    await noblox.getPlayerInfo({userId: parseInt(playerData.id)}).then(async (data) => {
        if(data.displayName !== data.username) playerData.username = `${data.displayName} (@${data.username})`; else playerData.username = data.username

        await noblox.getPlayerThumbnail(playerData.id, "720x720", "png", false, "Headshot").then((data) => {
            playerData.thumbnail = data[0].imageUrl
        }).catch((err) => console.error(err))

    }).catch((err) => {
        console.error(err)
        return res.sendStatus(400)
    })

    const infraction = await {type: infractionData.type, reason: infractionData.reason, notes: infractionData.note, date: new Date(), suspect: {name: playerData.username, id: playerData.id, thumbnail: playerData.thumbnail}, moderator: {avatar: `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`, username: req.user.username, id: req.user.discordId}}
    await Infractions.create(infraction).catch((err) => {console.error(err); return res.sendStatus(500)})

    if(process.env.LOGGING) {
        let channel = await discordClient.channels.cache.get(process.env.LOGGING_CHANNEL_ID)
        if(channel) {
            await channel.send({embeds: [
                new EmbedBuilder()
                .setTitle('New Infraction')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`)
                .setDescription(`${req.user.username} has infracted [${infraction.suspect.name}](https://roblox.com/users/${infraction.suspect.id})\n\n**Infraction Details**`)
                .addFields(
                    {name: 'Details', value: `Type: \`${infraction.type}\`\nReason: \`${infraction.reason}\`\nNotes: \`${infraction.notes}\`\nDate: <t:${Math.trunc(new Date(infraction.date).getTime() / 1000)}>`, inline: true},{name: 'Suspect', value: `[${infraction.suspect.name}](https://roblox.com/users/${infraction.suspect.id})`, inline: true},{name: 'Moderator', value: `<@${infraction.moderator.id}>`, inline: true}
                )
                .setColor('Orange')
            ]})
        }
    }

    return res.sendStatus(200)
})


module.exports = router
