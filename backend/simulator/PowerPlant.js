class PowerPlant{
    constructor(){
        this.defaultProduction = 100000;
        this.defaultConsumption = 200;
        this.hourlyProduction = 0;
        this.buffer = 0;
        this.online = false;
        this.changingState = false;
        this.batteryRatio = 0.5;
        this.hourlyConsumption = 0;
    }

    updateHour(){
        if(!this.online || this.buffer >= 50000000){
            return;
        }
        this.buffer += this.batteryRatio * this.hourlyProduction - this.hourlyConsumption;
    }

    getState(){
        if(this.online){
            if(!this.changingState){
                return "online";
            }
            else{
                return "shutting down";
            }

        }
        else{
            if(!this.changingState){
                return "offline";
            }
            else{
                return "starting";
            }
        }
    }

    getProduction(){
        return this.hourlyProduction;
    }

    toggleState(){
        if(this.getState() === "shutting down" || this.getState() === "starting"){
            return;
        }
        else if(this.getState() === "offline"){
            this.changingState = true;
            setTimeout(function(){ 
                this.changingState = false;
                this.hourlyProduction = this.defaultProduction;
                this.hourlyConsumption = this.defaultConsumption;
                this.online = true;
                console.log("plant online");
             }.bind(this), 30000);
        }
        else{
            this.changingState = true;
            setTimeout(function(){
                this.changingState = false;
                this.hourlyProduction = 0;
                this.hourlyConsumption = 0;
                this.online = false;
                console.log("plant offline");
            }.bind(this), 30000);
        }

    }

    getReleasedEnergy(){
        return this.hourlyProduction * (1-this.batteryRatio) - this.hourlyConsumption;
    }
}

module.exports = PowerPlant;