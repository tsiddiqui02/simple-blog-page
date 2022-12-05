const res = require("express/lib/response")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

function verifyToken(req, res, next){
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
            if(err) return res.redirect("/login")
            next()
        })
    } else{
        res.redirect("/login")
    }
}

function checkUser(req, res, next){
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
            if(err){
                res.locals.user = null
                next()
            } else{
                const user = await User.findById(decoded.id)
                res.locals.user = user
                next()
            }
        })
    } else{
        res.locals.user = null
        next()
    }
}
module.exports = {verifyToken, checkUser}