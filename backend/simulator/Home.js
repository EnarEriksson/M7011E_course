const gaussian = require('gaussian');

class Home{
    constructor(_isProsumer, _email){
        this.dailyElectricityDistribution = gaussian(0, 3000);
        this.dailyElectricityConsumption =  Math.abs(this.dailyElectricityDistribution.ppf(Math.random()));
        this.currentElectricityDistribution = gaussian(this.dailyElectricityConsumption/24, 10);
        this.currentElectricityConsumption = Math.abs(this.currentElectricityDistribution.ppf(Math.random()));
        this.isProsumer = _isProsumer;
        this.batteryRatio = 0.5;
        this.consumeBatteryRatio = 0.5;
        this.buffer = 0; //kWh
        this.producedThisHour = 0;
        this.releasedEnergy = 0;
        this.currentWind = 0;
        this.blackOut = false;
        this.email = _email;
        this.sellBlocked = false;
        this.tempRatio = 0.5;
        this.lastOnline = new Date(70, 1);
    }

    updateProduced(){
        if(this.isProsumer){
            this.producedThisHour = 0.8 * this.currentWind;
            var extraEnergy = this.producedThisHour - this.currentElectricityConsumption;
            if(extraEnergy >= 0){
                if(this.buffer <= 2000000) this.buffer += this.batteryRatio * extraEnergy;
                this.releasedEnergy = (1-this.batteryRatio)*extraEnergy;
            }
            else{
                var temp = this.buffer;
                this.buffer -= Math.min(-(this.consumeBatteryRatio*extraEnergy), this.buffer);
                if(this.buffer === 0){
                    this.releasedEnergy = extraEnergy + temp;
                }
                else{
                    this.releasedEnergy = (1-this.consumeBatteryRatio) * extraEnergy;
                }
            }
        }
        else{
            this.releasedEnergy = -this.currentElectricityConsumption;
        }
    }

    updateDay(){
        this.dailyElectricityDistribution = gaussian(0, 3000);
        this.dailyElectricityConsumption =  Math.abs(this.dailyElectricityDistribution.ppf(Math.random()));
        this.updateHour();
    }

    updateHour(){
        this.currentElectricityDistribution = gaussian(this.dailyElectricityConsumption/24, 10);
        this.currentElectricityConsumption = Math.abs(this.currentElectricityDistribution.ppf(Math.random()));
        this.updateProduced();
    }

    setValues(_batteryRatio, _consumeRatio, _buffer){
        this.batteryRatio = _batteryRatio;
        this.consumeBatteryRatio = _consumeRatio;
        this.buffer = _buffer;
    }


}

module.exports = Home;