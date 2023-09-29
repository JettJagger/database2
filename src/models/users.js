const {DataTypes} = require("sequelize");
const SQLconnection = require("../db/connect");

//create table for users called USER and make sure it is connected to the db
//define its properties
const User = SQLconnection.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    //validate makes sure the email is valid by policing its format and length
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
            len: [1,255]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

//export table User
module.exports = User;