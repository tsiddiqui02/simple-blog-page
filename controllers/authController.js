const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { nextTick } = require("process")

function createToken(id){
    return jwt.sign({id}, process.env.TOKEN_SECRET)
}

module.exports.get_signup = (req, res) => {
    res.render("signup.ejs")
}

module.exports.get_login = (req, res) => {
    res.render("login.ejs")
}

module.exports.post_signup = async (req, res) => {
    const hashedPass = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass
    })
    const user = await newUser.save()
    const token = createToken(user._id)
    res.redirect("/")
}

module.exports.post_login = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(user){
       const validatePass = await bcrypt.compare(req.body.password, user.password)
       if(validatePass){
           //res.json("You're logged in!")
           const token = createToken(user._id)
           res.cookie("jwt", token)
           res.redirect("/")
       } else{
           res.json("Password is wrong.")
       }
    } else{
        res.json("Email is wrong.")
    }
}

module.exports.logout = (req, res) => {
    res.cookie("jwt", "", {maxAge: 1}) 
    res.redirect("/")
}