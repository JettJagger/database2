//imports 
const {Router} = require("express");
const userRouter = Router();
const{registerUser, listAllUsers, deleteUser, updatePassword, loginUser} = require("../controllers/controllers");
const {hashPassword, passwordCheck, tokenCheck} = require("../middleware");

//create user 
userRouter.post("/user/register", hashPassword, registerUser); 

//list all users in the database
userRouter.get("/user/listAllUsers", tokenCheck, listAllUsers);

//delete users from database
userRouter.delete("/user/deleteUser", tokenCheck, deleteUser);

//update user password 
userRouter.put("/user/updatePassword", passwordCheck, updatePassword);

//user login and create new web token
userRouter.get("/user/login", passwordCheck, loginUser);


//export routes
module.exports = userRouter;