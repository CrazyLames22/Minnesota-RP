const router = require('express').Router();
const passport = require('passport');
require('dotenv').config()

router.get("/login/success", (req, res) => {
    if(req.user) {
        res.status(200).json({
            success: true,
            message: 'Login success',
            user: req.user
        })   
    } else {
        res.status(200).json({
            success: true,
            message: 'Not logged in'
        })
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(process.env.CLIENT_SITE)
})

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Login failed, please try again'
    })
})

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/login/failed'
}), function(req, res) {
    res.redirect(process.env.CLIENT_SITE) // Successful auth
});

module.exports = router