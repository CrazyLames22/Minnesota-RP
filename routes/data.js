const router = require('express').Router();
const noblox = require('noblox.js');
const Infractions = require('../models/Infraction')
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

router.get('/users/get', hasPerms(), async (req, res) => {
    let user = req.query.user
    let plrid = req.query.plrid
    if(user) {
    await noblox.getIdFromUsername(user).then(async (id) => {
        let playerData = {id: id, thumbnail: '', username: '', infractions: []}
        await noblox.getPlayerInfo({userId: parseInt(id)}).then((data) => {
            if(data.displayName !== data.username) playerData.username = `${data.displayName} (@${user})`; else playerData.username = data.username;
        }).catch((err) => console.error(err))

        await noblox.getPlayerThumbnail(id, "720x720", "png", false, "Headshot").then((data) => {
            playerData.thumbnail = data[0].imageUrl
        }).catch((err) => console.error(err))

        await Infractions.findAll({raw : true}).then(async (data) => {
            data.forEach((infraction) => {
                if(parseInt(JSON.parse(infraction.suspect).id) === parseInt(id)) {
                    playerData.infractions.push(infraction)
                }
            })
        })
        await playerData.infractions.reverse()
        return res.status(200).json(playerData)
    }).catch(() => {
        return res.status(400).send('User does not exist.');
    })
} else if(plrid) {
    let playerData = {id: parseInt(plrid), thumbnail: '', username: '', infractions: []}
    await noblox.getPlayerInfo({userId: parseInt(plrid)}).then(async (data) => {
        if(data.displayName !== data.username) playerData.username = `${data.displayName} (@${data.username})`; else playerData.username = data.username
        
        await noblox.getPlayerThumbnail(parseInt(plrid), "720x720", "png", false, "Headshot").then((data) => {
            playerData.thumbnail = data[0].imageUrl
        }).catch((err) => console.error(err))

        await Infractions.findAll({raw : true}).then((data) => {
            data.forEach((infraction) => {
                if(parseInt(JSON.parse(infraction.suspect).id) === parseInt(plrid)) {
                    playerData.infractions.push(infraction)
                }
            })
        })
        
        await playerData.infractions.reverse()
        return res.status(200).json(playerData)
    }).catch(() => {res.status(400).send('User does not exist.')})
} else res.status(400)
})



module.exports = router