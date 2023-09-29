//access to the table in the database
const User = require("../models/users");

//imports bcrypt 
const bcrypt = require("bcrypt");

const jwt = require ("jsonwebtoken");

//function to hash the passwords 
async function hashPassword(req, res, next) {
    try {
        console.log(req.body);
        const saltRounds = 11;
        const plainTextPassword = req.body.password;
        const hashPassword = await bcrypt.hash(plainTextPassword, saltRounds)
        req.body.password = hashPassword;
        next();
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message,
            error: error
        })
    }
}

//function to check passwords 
async function passwordCheck(req, res, next) {
    try {
        const userDetails = await User.findOne({where: {username: req.body.username }})
        console.log(userDetails);
        if (userDetails !== null) {
            var hashPassword = userDetails.password;
        } else {
            hashPassword = "Dummy"
        }
            const plainTextPassword = req.body.password;
            const match = await bcrypt.compare(plainTextPassword, hashPassword); 
       
       

        if (match && userDetails) {
            console.log("Password and User match");
            next()
            } else {
                throw new Error("Password and User do not match");
            };
        }

        catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message,
            error: error
        });
    }
}

//verification of JWT generated for each user -- The verification of the token is needed to make sure the header and payload of the token has not been changed
// compares the jwt that contains the original token and compares it to a test signature to make sure the header, signature and payload match hence a successful verification
async function tokenCheck(req, res, next) {
    try {
        const secretKey = process.env.JWTPASSWORD
        console.log(secretKey);
        const token = req.header("Authorization").replace("Bearer ", "")
        const decodedToken = jwt.verify(token, secretKey);
        const username = decodedToken.username;
        const user = await User.findOne({
            where: {
                username: username
            }
        })
        if (!user) {
            throw new Error ("User no longer in the database")
        } else {
            req.user = user;
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message,
            error: error
        });
    }
}

module.exports = {
    hashPassword,
    passwordCheck,
    tokenCheck
}