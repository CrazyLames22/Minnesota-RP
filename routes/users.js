const router = require('express').Router();
const noblox = require('noblox.js');
const Infractions = require('../models/Infraction')
require('dotenv').config()


router.get('/widget/get', async (req, res) => {
    if(!process.env.WIDGET) return res.sendStatus(200).json({status: false, id: null});
    return res.sendStatus(200).json({status: true, id: process.env.WIDGET_ID})
})

router.get('/users/get', async (req, res) => {
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
    }).catch((err) => {
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