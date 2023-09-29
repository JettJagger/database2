//imports dependencies and fileconnections 
const { Model, ExclusionConstraintError } = require("sequelize");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require ("dotenv").config()

//connection to create a route to create a new user in the database
async function registerUser (req, res) {
    try {
        console.log(req.body);
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });        
    //creates token before sending response
        const expirationTime = 1000*60*60*24*7 //1000 milliseconds*60seconds in a minute*60 minutes in an hour*24hours in a day*7 days in a week
        const privateKey = process.env.JWTPASSWORD //access to the secret key as an enviroment variable stored in .env without revealing it.
        
        const payload = { //payload is user details -- username to ensure you have the right user
            username: req.body.username
        }
         //establish an expiration time for when the token will expire and needs to be renewed.
        const options = {
            expiresIn: expirationTime
        };
        //where the signature process takes place and the token is established.
        const token = await jwt.sign(payload, privateKey, options)
        console.log(token);

        res.status(201).json({
            message: "User Registered in the database",
            user: {
                username: req.body.username,
                email: req.body.email,
                token: token
            }
        })
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message, 
            detail: error
        })
    }
};

//function to list all users in the database
async function listAllUsers (req, res) {
    try {
        const listOfUsers = await User.findAll();
        res.status(200).json({
            message: "All users from the database are:",
            userlist: listOfUsers
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message, 
            detail: error
        }) 
    }
}

//function to delete users from the database 
async function deleteUser (req, res) {
    try {
        const deleteResult = await User.destroy({
            where: {
                username: req.body.username
            }
        });
        console.log(deleteResult);
        res.status(200).send("User deleted");
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message, 
            detail: error
        }) 
    }
}

//function to update user password
async function updatePassword (req, res) {
    try {
        const saltRounds = 11;
        const plainTextPassword = req.body.newPassword;
        const hashPassword = await bcrypt.hash(plainTextPassword, saltRounds)
        const updateResult = await User.update(
           {password: hashPassword},
           {where: {username:req.body.username}}
        )
        console.log(updateResult);
        res.status(200).send("Password updated");
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message, 
            detail: error
        })  
    }
}

//Login user 
async function loginUser (req, res) {
    try {
        //how to find a user by their username
        const user = await User.findOne({where: {username: req.body.username}});
         
        //jwt for the user log in 
        const expirationTime = 1000*60*60*24*7;
        const privateKey = process.env.JWTPASSWORD
        const payload = {
            username: req.body.username
        };
        const options = {
            expiresIn: expirationTime
        }

        const token = await jwt.sign(payload, privateKey, options);

        console.log(token);

        res.status(201).json({
            message: `${payload} has been logged in successfully!`,
            user: {
                username: user.username,
                email: user.email,
                token: token
            },
        })
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: error.message, 
            detail: error
        })
    }
}

//export functions for the connections 
module.exports = {registerUser, listAllUsers, deleteUser, updatePassword, loginUser};