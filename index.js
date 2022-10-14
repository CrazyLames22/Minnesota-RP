const cookieSession = require('cookie-session')
const express = require('express')
const passport = require('passport')
const cors = require('cors')
const app = express()
const path = require('path');
const Discord = require("discord.js")
const { GatewayIntentBits } = require('discord.js')
const db = require('./database')
const fs = require('fs')
const authRoute = require('./routes/auth')
const infractionRoute = require('./routes/infraction')
const userRoute = require('./routes/users')
const dataRoute = require('./routes/data')
const rateLimit = require('express-rate-limit')
const {execSync} = require('child_process')
var loadingSpinner = require('loading-spinner');
var favicon = require('serve-favicon')
require('./passport')
require('dotenv').config()
require('colors')

const runServer = () => {
app.use(favicon('./favicon.ico'))
const client = new Discord.Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds
    ]
})

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use('/users', limiter)

app.use(cookieSession(
    {name:"session",
    keys: ["cleaver footer voter catacomb catfish caution scarce observing gallantly impromptu photo professor"],
    maxAge: 24 * 60 * 60 * 100}
))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))

app.use("/auth", authRoute)
app.use("/infractions", infractionRoute)
app.use("/public", userRoute)
app.use("/data", dataRoute)
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

client.on('ready', async () => {
    app.listen(process.env.PORT, async () => {
        console.log('---------------'.gray.bold)
        console.log('The server has started'.cyan)
        console.log(`Running on port: ${process.env.PORT}`.cyan.bold)
        console.log('---------------'.gray.bold)
    
        db.authenticate()
        .then(async () => {
            console.log('----------------------'.gray.bold);
            console.log('Database: '.green.bold + 'Successfully authenticated!'.green)
            console.log('----------------------'.gray.bold);
            //ticketModel.init(db);
            //ticketModel.sync();
    
            const files = fs //EVENT HANDLER
                .readdirSync("./models")
                .filter(file => file.endsWith('.js'))
    
            for (const file of files) {
                const temp = await require(`./models/${file}`)
                temp.init(db);
                temp.sync();
            }
    
        }).catch(err => console.log(err));
    })
})

global.discordClient = client;
client.login(process.env.BOT_TOKEN)

}

const startServer = async () => {
    console.log('Building application, please wait...'.red.bold)
    loadingSpinner.start(250, {
    clearChar: true
    });
    if(! await fs.existsSync('./client/node_modules')) {
        await execSync("cd client && npm install");
    }
    if (await fs.existsSync('./build')) {
        await fs.rmSync('./build', {recursive: true, force: true}, () => {return console.log('Deleted prior build.'.green)})
    }
    await execSync("cd client && npm run build");
    if(fs.existsSync('./client/build')) {
        fs.rename('./client/build', './build', function (err) {
            if (err) throw err
            loadingSpinner.stop();
            runServer();
        })
    } else {throw new Error('Failed to build react project.')}
}
startServer()
