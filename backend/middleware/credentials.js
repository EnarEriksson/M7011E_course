const Home = require('../schemas/home');
const User = require("../schemas/user");
const bcrypt = require("bcryptjs");

const setUserName = async (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    console.log(email + " " + username);
    const user = await User.findOne({email: email});
    user.username = username;
    try{
        await user.save();
        res.send(username);
    }
    catch (e){
        res.status(500).send({message: "Already taken or something"});
    }
};

const setFullName = async (req, res) => {
    const email = req.body.email;
    const fullname = req.body.fullname;
    const user = await User.findOne({email: email});
    user.fullname = fullname;
    try{
        await user.save();
        res.send(fullname); 
    }
    catch (e) {
        res.status(500).send({message: "Already taken or something"});
    }
};

const setPassWord = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email: email});
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    try{
        await user.save();
        res.send("password updated");
    }
    catch (e) {
        res.status(500).send({message: "Saving password failed somehow"});
    }
};



module.exports = {setUserName, setFullName, setPassWord};