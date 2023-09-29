//imports
require("dotenv").config();
const express = require("express");

//changing express to app
const app = express();

//router import 
const userRouter = require("./routes/routes");
//import users
const User = require("./models/users");

//declear which port the server should listen to 
const port = process.env.PORT || 5001; //if the server cant find 5002, it will load on 5001

function syncTables() {
    User.sync();
    //creates the user table is it does not already exist otherwise it does nothing.
}

//app.use is for middleware
app.use(express.json())
//middleware allows use of routes
app.use(userRouter);


//health check for API and to check server is working 
app.get("./health", (req, res) => {
    res.status(200).json({
        message: "This API is alive and healthy"
    })
})

//listens to server 
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    syncTables();
});




