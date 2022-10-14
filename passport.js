var DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport')
const User = require('./models/User')
require('dotenv').config()

var scopes = ['identify'];

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `http://${process.env.CLIENT_SITE}/auth/discord/callback`,
    scope: scopes,
},
async function(accessToken, refreshToken, profile, done) {
    let [user, created] = await User.findOrCreate({where: { discordId: profile.id }, defaults: {discordId: profile.id}})
    if(user) {
        await user.update({username: profile.username + '#' + profile.discriminator, avatar: profile.avatar})
        let member = await discordClient.guilds.cache.get(process.env.GUILD_ID).members.fetch(user.discordId)
        if(member) {
            if(member.roles.cache.has(process.env.REQUIRED_PANEL_ACCESS_ROLE_ID)) await user.update({moderator: true}); else await user.update({moderator: false});
        }
        return done(null, user)
    } else {
        return done(true, null)
    }
}));

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})
