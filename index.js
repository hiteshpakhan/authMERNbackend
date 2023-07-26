const express = require("express");
var bodyParser = require("body-parser");
const connectDb = require("./db/dbConnection");
const app = express();
const User = require("./db/user");
const cors = require("cors");
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// middleware
app.use(express.json());

connectDb();

// enable cors
app.use(cors());


// registration
app.post("/register",async(req,res) => {
    const userdata = new User(req.body);
    try{
        await userdata.save();
        res.status(201).send({message: "Registration successful"});
    }
    catch(error){
        res.status(400).json({error});
    }
})

// login
app.post("/login", async(req, res)=>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});

        if(!user){
            return res.status(401).json({error: "invalid username or password"});
        }

        if(user.password !== password){
            return res.status(401).json({error: "invalid password"})
        }
        res.status(200).json({message: "login seccessfull"})
    }
    catch(error){
        res.status(500).json({error: "login failed"})
    }
})


app.listen(port, ()=> {
    console.log("server is running on 8000");
})