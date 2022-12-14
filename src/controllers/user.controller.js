const express = require('express');

const User = require('../models/user.model');
const router = express.Router();
const { authenticate } = require("../middlewares/authorization");

const jwt = require('jsonwebtoken');
require('dotenv').config();
const newToken = (user)=>{
    return jwt.sign({ user }, process.env.JWT_SECRET)
}
router.get('/',authenticate, async(req, res) => {
    try {
        const UserData = await User.find().lean().exec();
        return res.status(203).json(UserData);
    }
    catch (err) {
        return res.status(500).json({message: err.message});
    }
})

router.post('/post', async(req, res) => {
    try {
        const UserData = await User.create(req.body)
        const token = newToken(UserData);
        return res.status(203).json({token : token, firstName : UserData.first_name, lastName : UserData.last_name});
    }
    catch (err) {
        return res.status(500).json({message: err.message});
    }
})


router.get('/login', async(req, res) => {
    try {
        const UserData = await User.findOne({email : req.body.email});
        if(UserData){
            const match =  UserData.checkPassword(req.body.password);
            if(match){
                const token = newToken(UserData);
                return res.status(200).json({
                    firstName : UserData.first_name, 
                    lastName : UserData.last_name, 
                    token : token
                });    
            } else {
                return res.status(403).json({
                    success: false,
                    message: "Incorrect Email or Password",
                })
            }
        } else {
            return res.status(404).json({message : 'User not found'});
        }
    }
    catch (err) {
        return res.status(500).json({message: err.message, error : 'this is an error'});
    }
})

router.get('/jwt', async(req, res) =>{
    try {
        const user = await User.findOne({email : req.body.email}).lean().exec();
        if(user){
            const token = newToken(user);
            res.cookie('token', token, { httpOnly : true });
            return res.status(204).json({message: 'success set new token', token});
        } else {
            return res.status(404).json({message : "provide correct email"});
        }
    }
    catch (err) {
        return res.status(404).json({message : "provide correct email"});
    }
})
module.exports = router;