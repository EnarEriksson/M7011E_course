const Simulator = require('../simulator/simulator');
const currentSim = new Simulator();
const Home = require('../schemas/home');
const User = require("../schemas/user");




const allHomes = Home.find({}, function(err, docs) {
    if (err) console.log(err);
}).then(allHomes => {
    console.log(allHomes.length);
    if(allHomes === undefined || allHomes.length === 0){
        return;
    }
    for(var i = 0; i < allHomes.length; ++i){
        currentSim.addHome(allHomes[i].prosumer, allHomes[i].ownerEmail);
        currentSim.homes[i].setValues(allHomes[i].batteryRatio, allHomes[i].consumeRatio, allHomes[i].buffer);
    }
});
currentSim.runSim();

const getAllUsers = async(req, res) => {
    var userList = currentSim.getUserList();
    res.send(userList);

};

const getWind = (req, res) => {
    res.send(currentSim.getCurrentWind().toString());
};

const getPrice = (req, res) => {
    res.send(currentSim.getPrice().toString());
};



const getHome = async (req, res) => {
    const email = req.header('email');
    const homeIndex = currentSim.getHomeIndex(email);
    if(homeIndex < 0){
        return res.status(404).json({ message: "Home not found" });
    }
    console.log("homeindex: " + homeIndex);
    var buffer = currentSim.getProsumerBuffer(homeIndex);
    var batteryRatio = currentSim.getBatteryRatio(homeIndex);
    var consumeRatio = currentSim.getConsumeBatteryRatio(homeIndex);
    var production = currentSim.getProsumerProduction(homeIndex);
    var consumption = currentSim.getProsumerConsumption(homeIndex);
    var wind = currentSim.getCurrentWind();
    var price = currentSim.getPrice();
    var sellBlocked = currentSim.getSellBlock(homeIndex);
    var user = await User.findOne({email: email});
    var username = user.username;
    res.send({
        buffer: buffer,
        batteryRatio: batteryRatio,
        consumeRatio: consumeRatio,
        production: production,
        consumption: consumption,
        sellblocked: sellBlocked,
        wind: wind,
        price: price,
        username: username
    });
};

const getPlantInfo = (req, res) => {
    var status = currentSim.getPlantStatus();
    var batteryRatio = currentSim.getPlantBatteryRatio();
    var modeledPrice = currentSim.getModeledPrice();
    var consumption = currentSim.getTotalConsumption();
    var production = currentSim.getTotalProduction();
    var buffer = currentSim.getPlantBuffer();
    var plantProduction = currentSim.getPlantProduction();
    res.send({
        status: status,
        batteryRatio: batteryRatio,
        modeledPrice: modeledPrice,
        consumption: consumption,
        production: production,
        buffer: buffer,
        plantProduction: plantProduction
    });
};

const setPrice = (req, res) => {
    const price = Number(req.body.price);
    currentSim.setPrice(price);
    res.send(currentSim.getPrice().toString());
};

const setBatteryRatio = (req, res) => {
    const homeIndex = currentSim.getHomeIndex(req.header('email'));
    if(homeIndex < 0){
        return res.status(404).json({ message: "Home not found" });
    }
    const ratio = Number(req.body.batteryRatio);
    console.log("index: " + homeIndex);
    console.log("ratio: " + ratio);
    currentSim.setBatteryRatio(homeIndex, ratio);
    res.send(currentSim.getBatteryRatio(homeIndex).toString());
};

const sellBlock = (req, res) => {
    const homeIndex = currentSim.getHomeIndex(req.body.email);
    if(homeIndex < 0){
        return res.status(404).json({ message: "Home not found" });
    }
    const seconds = req.body.seconds;
    console.log(seconds);
    console.log(homeIndex);
    currentSim.sellBlock(homeIndex, seconds);
    res.send(req.body);
};

const setConsumeRatio = (req, res) => {
    const homeIndex = currentSim.getHomeIndex(req.header('email'));
    if(homeIndex < 0){
        return res.status(404).json({ message: "Home not found" });
    }
    const ratio = Number(req.body.consumeRatio);
    currentSim.setConsumeBatteryRatio(homeIndex, ratio);
    res.send(req.body);
};

const setPlantRatio = (req, res) => {
    const ratio = Number(req.body.batteryRatio);
    currentSim.setPlantRatio(ratio);
    res.send(req.body);
};

const addHome = (req, res) => {
    console.log("adding home");
    const {isprosumer, email} = req.body;
    currentSim.addHome(isprosumer, email);
    currentSim.setOnlineUser(email);
    const defaultRatio = 0.5;
    const zero = 0;
    home = new Home({
        prosumer: isprosumer,
        batteryRatio: defaultRatio,
        consumeRatio: defaultRatio,
        buffer: zero,
        ownerEmail: email
    });
    home.save(function (err, doc){
        if (err) console.log(err);
        else console.log("added new home to db");
    });
};

const setPlantState = (req, res) => { 
    currentSim.plant.toggleState();
    res.send(currentSim.plant.getState());
};

const getBlackOuts = (req, res) => {
    const blackedOut = currentSim.getBlackOuts();
    res.send(blackedOut);
};

const deleteUser = async(req, res) => {
    console.log("DELETING USER: " + req.body.email);
    const email = req.body.email;
    const homeIndex = currentSim.getHomeIndex(email);
    if(homeIndex < 0){
        return res.status(404).json({ message: "Home not found" });
    }
    try{
        await User.deleteOne({email: email});
        await Home.deleteOne({ownerEmail: email});
        currentSim.homes.splice(homeIndex, 1); 
        res.send(req.body); 
    }
    catch(e){
        res.status(500).send({message: "could not delete user"});
    }
};


const setOnlineUser = function(email){
    currentSim.setOnlineUser(email);
};




module.exports = {
    getPrice, getWind, getHome, addHome,
    setBatteryRatio, setConsumeRatio,
    getPlantInfo, setPrice, setPlantRatio,
    setPlantState, getBlackOuts, getAllUsers,
    sellBlock, deleteUser, setOnlineUser
};