const gaussian = require('gaussian');
const SimData = require('../schemas/simData');
const dbHome = require('../schemas/home');
const Home = require('./Home');
const PowerPlant = require('./PowerPlant');




class Simulator{
    constructor(){
        this.dailyWindDistribution = gaussian(0, 25);
        this.dailyWind = Math.abs(this.dailyWindDistribution.ppf(Math.random()));
        this.currentWindDistribution = gaussian(this.dailyWind, 10);
        this.currentWind = Math.abs(this.currentWindDistribution.ppf(Math.random()));
        this.homes = [];
        this.plant = new PowerPlant();
        this.price = 1.5;
        this.currentHour = 0;
        this.modeledPrice = 1.5;
        this.initDatafromDB();

    }

    

    initDatafromDB(){
        const data = SimData.find({}, function(err, docs) {
            if(err) console.log(err)
        }).then( data => {
            if(data === undefined || data.length === 0){
                return;
            }
            else{
                this.price = data[0].price;
                this.modeledPrice = data[0].modeledPrice;
                this.wind = data[0].wind;
                this.plant.buffer = data[0].plantBuffer;
                this.plant.batteryRatio = data[0].plantRatio;
                this.plant.online = data[0].plantOnline;
                this.plant.hourlyConsumption = data[0].plantConsumption;
                this.plant.hourlyProduction = data[0].plantProduction;
            }
        }).catch( err => {
            console.log("error reading simdata");
        })
    }

    runSim(){
        setInterval(function() {this.updateHour();}.bind(this), 5000);
    }


    getCurrentWind(){
        return this.currentWind;
    }

    addHome(isProsumer, email){
        var prosumer = (isProsumer.toString() == 'true');
        var home = new Home(prosumer, email);
        home.currentWind = this.currentWind;
        this.homes.push(home);
        console.log("added home with email: " + email + " and isprosumer: " + prosumer);
    }

    updateDay(){
        this.dailyWindDistribution = gaussian(0, 25);
        this.dailyWind = Math.abs(this.dailyWindDistribution.ppf(Math.random()));
        if(this.homes !== undefined){
            for (var i = 0; i < this.homes.length; ++i){
                this.homes[i].updateDay();
            }
        }
        this.updateHour();
        console.log("A new day has arrived. The wind today is: " + this.dailyWind);
        this.saveSimData();
        this.saveHomeData();
    }

    saveSimData(){
        const data = SimData.find({}, function(err, docs) {
            if(err) console.log("eror occurred: " + err);
        }).then( data => {
            if(data === undefined ){
                console.log("error retrieving simulator data");
                return;
            }
            else if(data.length === 0){
                const simdata = new SimData({
                    wind: this.currentWind,
                    price: this.price,
                    modeledPrice: this.modeledPrice,
                    plantBuffer: this.plant.buffer,
                    plantRatio: this.plant.batteryRatio,
                    plantOnline: this.plant.online,
                    plantProduction: this.plant.hourlyProduction,
                    plantConsumption: this.plant.hourlyConsumption
                })
                simdata.save().then(console.log("saved new simdata")).catch(err => {console.log("failed to save new simdata")});
                return;
            }
            else{
                data[0].wind = this.currentWind;
                data[0].price = this.price;
                data[0].modeledPrice = this.modeledPrice;
                data[0].plantBuffer = this.plant.buffer;
                data[0].plantRatio = this.plant.batteryRatio;
                data[0].plantOnline = this.plant.online;
                data[0].plantProduction = this.plant.hourlyProduction;
                data[0].plantConsumption = this.plant.hourlyConsumption;
                data[0].save().then(console.log("updated existsing simdata")).catch(err => {console.log("failed to update simdata")});
            }
        }).catch(err => {console.log("could not find simdata")})
    }

    async saveHomeData() {
        if(this.homes === undefined){
            return;
        }
        for(var i = 0; i < this.homes.length; ++i){
            const email = this.homes[i].email;
            try{
                const home = await dbHome.findOne({ownerEmail: email})
                home.batteryRatio = this.homes[i].batteryRatio;
                home.consumeRatio = this.homes[i].consumeBatteryRatio;
                home.buffer = this.homes[i].buffer;
                await home.save();
            }
            catch(e){
                console.error(e);
            }
        }
    }


    updateHour(){
        if(this.currentHour === 23){
            this.currentHour = 0;
            this.updateDay();
            this.currentHour = 0; //updateDay will have incremented this through updateHour
            return;
        }
        this.currentHour += 1;
        this.currentWindDistribution = gaussian(this.dailyWind, 10);
        this.currentWind = Math.abs(this.currentWindDistribution.ppf(Math.random()));
        this.plant.updateHour();
        if(this.homes !== undefined){
            for (var i = 0; i < this.homes.length; ++i){
                this.homes[i].updateHour();
                this.homes[i].currentWind = this.currentWind;
            }
        }
        var totalProduction = this.getTotalProduction();
        var spareEnergy = this.setBlackouts(totalProduction);
        this.updatePrice(spareEnergy);
    }

    updatePrice(spareEnergy){
        var consumption = this.getTotalConsumption();
        if(consumption === 0){
            return;
        }
        var dependSpare = (spareEnergy-this.plant.getReleasedEnergy())/(consumption);
        //this.modeledPrice = 1.5/(dependSpare*0.15)
        this.modeledPrice = 1.5 - (dependSpare * 0.15);    
    }

    getPrice(){
        return this.price;
    }

    setPrice(num){
        this.price = num;
    }

    setBlackouts(totalProduction){
        if(this.homes === undefined){
            return 0;
        }

        for (var i = 0; i < this.homes.length; ++i){
            var requiredEnergy = -this.homes[i].releasedEnergy;
            if (totalProduction <= 0 && this.homes[i].releasedEnergy < 0){ //If no more energy is available to distribute
                /*this.homes[i].blackOut = true;
                totalProduction -= requiredEnergy;*/
                if(this.plant.buffer >= requiredEnergy){ //Take energy from the plant buffer
                    this.plant.buffer -= requiredEnergy;
                    this.homes[i].blackOut = false;
                }
                else{                               //Not enough energy in the plant buffer, set blackout
                    this.plant.buffer = 0;
                    this.homes[i].blackOut = true;
                    totalProduction -= requiredEnergy;
                }
            }
            else if (this.homes[i].releasedEnergy < 0){
                if (totalProduction >= requiredEnergy){
                    totalProduction -= requiredEnergy;
                    this.homes[i].blackOut = false;
                }
                else{
                    /*
                    totalProduction -= requiredEnergy;
                    this.homes[i].blackOut = true;*/
                    if(this.plant.buffer >= requiredEnergy){ //Take energy from the plant buffer
                        this.plant.buffer -= requiredEnergy;
                        this.homes[i].blackOut = false;
                    }
                    else{                               //Not enough energy in the plant buffer, set blackout
                        this.plant.buffer = 0;
                        this.homes[i].blackOut = true;
                        totalProduction -= requiredEnergy;
                    }
                }
            }
            else{
                this.homes[i].blackOut = false;
            }
        }
        return totalProduction;
    }

    //The total electricity consumption for all homes in the current hour
    getTotalConsumption(){
        if(this.homes === undefined){
            return 0;
        }
        var total = 0;
        for (var i = 0; i < this.homes.length; ++i){
            total += this.homes[i].currentElectricityConsumption;
        }
        total += this.plant.hourlyConsumption;
        return total;
    }

    getHomeIndex(email){
        if(this.homes === undefined){
            return -1;
        }
        for(var i = 0; i < this.homes.length; ++i){
            if(this.homes[i].email === email){
                return i;
            }
        }
        return -1;
    }

    //The excess energy released by all homes in the current hour. Can be negative.
    getTotalProduction(){
        if(this.homes === undefined){
            return 0;
        }
        var total = 0;
        for (var i = 0; i < this.homes.length; ++i){
            total += this.homes[i].releasedEnergy;
        }
        total += this.plant.getReleasedEnergy(); //The energy produced by the plant not going to the buffer
        return total;
    }

    getProsumerProduction(index){
        return this.homes[index].producedThisHour;
    }
    
    getProsumerConsumption(index){
        return this.homes[index].currentElectricityConsumption;
    }

    getProsumerBuffer(index){
        return this.homes[index].buffer;
    }

    getBatteryRatio(index){
        return this.homes[index].batteryRatio;
    }

    getConsumeBatteryRatio(index){
        return this.homes[index].consumeBatteryRatio;
    }

    setBatteryRatio(index, input){
        if(this.homes[index].sellBlocked){
            return;
        }
        this.homes[index].batteryRatio = input;
    }

    setConsumeBatteryRatio(index,  input){
        this.homes[index].consumeBatteryRatio = input;
    }

    getPlantStatus(){
        return this.plant.getState();
    }

    getPlantBatteryRatio(){
        return this.plant.batteryRatio;
    }

    getPlantBuffer(){
        return this.plant.buffer;
    }

    getPlantProduction(){
        return this.plant.hourlyProduction;
    }

    getModeledPrice(){
        return this.modeledPrice;
    }

    setPlantRatio(num){
        this.plant.batteryRatio = num;
    }

    getBlackOuts(){
        var users = [];
        if(this.homes === undefined){
            return users;
        }
        for(var i = 0; i < this.homes.length; ++i){
            if(this.homes[i].blackOut){
                users.push(this.homes[i].email);
            }
        }
        return users;
    }

    /*getAllEmails(){
        var users = [];
        if(this.homes === undefined){
            return users;
        }
        for(var i = 0; i < this.homes.length; ++i){
            users.push(this.homes[i].email);
        }
        return users;
    }*/

    getUserList(){
        var users = [];
        var now = new Date();
        if(this.homes === undefined){
            return users;
        }
        for(var i = 0; i < this.homes.length; ++i){
            var subArray = [];
            subArray.push(this.homes[i].email);
            if(now-this.homes[i].lastOnline <= 3600000){ //If this person has a valid token
                subArray.push("online");
            }
            else{
                subArray.push("offline");
            }
            users.push(subArray);
        }
        return users;
    }

    setOnlineUser(email){
        const index = this.getHomeIndex(email);
        this.homes[index].lastOnline = new Date();
    }

    sellBlock(index, seconds){
        if(this.homes[index].sellBlocked) return;
        this.homes[index].sellBlocked = true;
        this.homes[index].tempRatio = this.homes[index].batteryRatio;
        this.homes[index].batteryRatio = 1;
        console.log("blocked a user")
        setTimeout(function(){
            this.homes[index].sellBlocked = false;
            this.homes[index].batteryRatio = this.homes[index].tempRatio;
            console.log("unblocked the user");
        }.bind(this), seconds * 1000);
    }

    getSellBlock(index){
        return this.homes[index].sellBlocked;
    }

}


module.exports = Simulator;