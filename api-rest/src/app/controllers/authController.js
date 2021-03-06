const express = require('express')
const User  = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const router = express.Router()

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {expiresIn: 86400})
}

const authConfig = require('../../config/auth.json')

router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if(await User.findOne({ email }))
            return res.status(400).send({error: 'User already exists!'})
        
        const user = await User.create(req.body)

        //Avoid show password after create new user
        user.password = undefined;

        return res.send({
            user,
            token:generateToken({ id: user.id }),
        })

    } catch (error) {
        return res.status(400).send({error: 'registration failed!'})
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password')

    if(!user)
        return res.status(400).send({error: 'User not found'})

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'Invalid password'})

    //Avoid show password after create new user
    user.password = undefined

    res.send({ 
        user, 
        token: generateToken({ id: user.id })
     });

})

//Forgot password
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user)
            return res.status(400).send({error: 'Invalid user ¬.¬'})

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        mailer.sendMail({
            to: email,
            from: 'doug16042@gmail.com',
            template: 'auth/forgotPassword',
            context: { token }
        }, (err) => {
            if(err)
               return res.status(400).send({error: 'Can not send a e-mail to this address. Try again'})
            
            return res.send();
        })

        console.log(token)
    } catch (error) {
        res.status(400).send({ error: "Failed! Error on forgout password, try again"})

    }
})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;
    
    try {
        const user = await User.findOne({ email })
        .select("+passwordResetToken passwordResetExpires")

        if(!user)
            return res.status(400).send({error: 'User not found'})
        
        if(token !== user.passwordResetToken)
            return res.status(400).send({error: 'Invalid token'})

        const now = new Date();

        if(now > user.passwordResetExpires)
            return res.status(400).send({error: 'Token expired, generate a new one'})

        user.password = password;

        await user.save();

        res.send();
    } catch (error) {
        res.status(400).send({error: 'Can not reset password'})
    }
})

module.exports = app => app.use('/auth', router)