import React from "react";
import { Redirect } from 'react-router-dom';
import Slider from 'react-input-slider';
import '../prosumers/pro.css'
import axInstance from '../axiosconfig.js';
export default class Manager extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            wind: null,
            plantstus:  null,
            marketdemand: null,
            production: null,
            consumption: null,
            buffer: null,
            price:null,
            modelprice: null,
            batteryRatio: null,
            plantProduction: null,
            email: this.props.location.state.email,
            token: this.props.location.state.token,
            username:null ,
            name: null,
            useremail: null,
            newbatratio: null,
            image: new FormData(),
            newimage: null,
            imgtest: null,
            impath: '',
            blackouts:["",""] ,
            userlist:["",""] ,
            newprice: null,
            cases: "stay"
        }
    }

    handleSubmit = event =>{
        event.preventDefault();
        axInstance.get('/users',{
            headers:{
            token: this.state.token,
            adminemail: this.state.email,
        }
        }).then(res =>{
            this.setState({userlist: res.data});
         }).catch(function(error) {

        })
        axInstance.get('/price',{
            }).then(res =>{
            this.setState({price: res.data});
        }).catch(function(error) {
    
        })
        axInstance.get('/blackouts',{
            headers:{
            token: this.state.token,
            adminemail: this.state.email,
        }}).then(res =>{
            this.setState({blackouts: res.data})
            
        }).catch(function(error){})
        axInstance.get('/plantInfo',{
            headers:{
            token: this.state.token,
            adminemail: this.state.email,
        }}).then(res =>{
            this.setState({production: res.data.production});
            this.setState({consumption: res.data.consumption});
            this.setState({buffer: res.data.buffer});
            this.setState({batteryRatio: res.data.batteryRatio});
            this.setState({modelprice: res.data.modeledPrice});
            this.setState({plantProduction: res.data.plantProduction})
        }).catch(function(error){})
        };
        powerPlantSubmit = event =>{
        event.preventDefault();
        axInstance.put('/plantState',{hej:null},{
            headers:{
            token: this.state.token,
            adminemail: this.state.email,
        } }).then(res =>{
        }).catch(function(error) {
    
        })
        };
    handleSubmitbat = event =>{
        event.preventDefault();
        axInstance.put('/plantRatio',{batteryRatio: this.state.newbatratio},{
            headers:{
            token: this.state.token,
            adminemail: this.state.email,
         }}).then(res =>{
            this.setState({batteryRatio: res.data.batteryRatio})
        }).catch(function(error) {
        
        })
    };

    handleChangebattery= event =>{
        this.setState({newbatratio:  Math.round(100*event.target.value)/100});
    };

    handleChangePrice= event =>{
        this.setState({newprice: event.target.value});
    };

    handlePriceSubmit= event =>{
        event.preventDefault();
        axInstance.put('/price',{price: this.state.newprice},{
            headers:{
                token: this.state.token,
                adminemail: this.state.email,
        } }).then(res =>{
            this.setState({price: res.data})
        }).catch(function(error) {
            
            })
        };

    handleRefresh(){
        axInstance.get('/adminCredentials',{
            headers:{
                token: this.state.token,
                adminemail: this.state.email,
            }
        }).then(res =>{
        this.setState({username: res.data.username})
        this.setState({name: res.data.fullname})
        }).catch(function(error) {

        })
        axInstance.get('/blackouts',{
            headers:{
            token: this.state.token,
            adminemail: this.state.email,
        }}).then(res =>{
            this.setState({blackouts: res.data})
            
        }).catch(function(error){})
        axInstance.get('/users',{
            headers:{
                token: this.state.token,
                adminemail: this.state.email,
            }
        }).then(res =>{
            this.setState({userlist: res.data});
        }).catch(function(error) {

        })
        axInstance.get('/price',{
        }).then(res =>{
            this.setState({price: res.data});
        }).catch(function(error) {

        })
        axInstance.get('/plantInfo',{
            headers:{
                token: this.state.token,
                adminemail: this.state.email,
        }}).then(res =>{
            this.setState({plantstus: res.data.status});
            this.setState({production: res.data.production});
            this.setState({consumption: res.data.consumption});
            this.setState({buffer: res.data.buffer});
            this.setState({batteryRatio: res.data.batteryRatio});
            this.setState({modelprice: res.data.modeledPrice});
            this.setState({plantProduction: res.data.plantProduction})
        }).catch(function(error){
        })
        this.setState({impath: 'http://130.240.200.61:5000/adminpictures/'+this.state.username + '?'+Date.now()})
            };
                
    getBlackoutString(){
        var blackoutstring = "";
        for(var i=0; i< this.state.blackouts.length; i++)
        {
            blackoutstring += (this.state.blackouts[i] + "\n")
        }
        return blackoutstring
    };

    getUser(Usermail){
        this.setState({useremail: Usermail})
        this.setState({cases: "gotoUser"})
    };

    BlackOuts() {
        const blackouts = this.state.blackouts
        const ret = blackouts.map(str => <p>{str}</p>)
        return ret;
    };

    UserOut() {
        const users = this.state.userlist
        const ret1 = users.map(str =>
        <p><button id="gnrl"  onClick={() => this.getUser(str[0])}>{str[0] + " " + str[1]}</button></p>
        )
        return ret1;
    };

    handlelogout=event=>{
        event.preventDefault();
        this.setState({cases: "login"})
    };

    fileselectHandler= event =>{
        event.preventDefault();
        this.setState({newimage: event.target.files[0]})
    };

    handleImage= event =>{
        event.preventDefault();
        if(this.state.newimage != null){
            this.setState({impath: ''})
            var typeimg = this.state.newimage.name.split('.')
            let formd = new FormData();
            formd.append('file', this.state.newimage,this.state.newimage.name)
            axInstance.post('/adminpictures', formd,{headers:{
                adminemail: this.state.email,
                token: this.state.token,
                thistype: ('.' + typeimg[typeimg.length-1]),
            }}).then(res =>{
            }).catch(function(error) {

            })
            this.setState({impath: 'http://130.240.200.61:5000/adminpictures/'+this.state.username + '?'+Date.now()}) 
        }
    };
            
    
    componentDidMount(){
        this.handleRefresh()
        this.interval = setInterval(() => this.handleRefresh(), 10000);
    };

    componentWillUnmount(){
        
        clearInterval(this.interval);
    };
  
   

    render(){switch(this.state.cases){

        case "login": {
            return <Redirect to={{pathname:"/adminLogin"}}/> 
        }
        case "gotoUser":
            {
                return <Redirect to={{pathname:"/ManagerPro", state: { token: this.state.token, email: this.state.email, User: this.state.useremail}}}/> 
            }
        default:{
            return(
            <div className="all">
                <form onsubmit={this.handleSubmit} className="info">
                    <label>
                    <p>User List:</p>
                    <p>{this.UserOut()}</p>
                    </label>
                </form>
                <div className="changes">
                    <form onSubmit={this.handleImage} className="info2">
                        <img className="houseimg" src={this.state.impath} alt="House picture"/>
                        <input type="file" onChange={this.fileselectHandler}></input>
                        <button type="submit">Upload</button>
                        <p>Username: {this.state.username}</p>
                        <p>Name: {this.state.name}</p>
                        <p>Email: {this.state.email}</p>
                    </form>
                    <form onsubmit={this.handleSubmit} className="info">
                        <label>
                        <p>Blackouts:</p>
                        <p>{this.BlackOuts()}</p>
                        </label>
                    </form>
                </div>
                <form onSubmit={this.handleSubmit} className="info">
                    <label>
                    
                        <p>Plant Status: {this.state.plantstus}</p>
                        <p>Plant Production:{this.state.plantProduction}</p>
                        <p>Market Demand: {(-1)*(Math.round((10*Number(this.state.production))))/10}kWh</p>
                        <p>Total Current Consumption: {(Math.round((10*Number(this.state.consumption))))/10}kWh</p>
                        <p>Buffer Size: {(Math.round((10*Number(this.state.buffer))))/10}kWh</p>
                        <p>Price: {(Math.round((100*Number(this.state.price))))/100}kr/kWh</p>
                        <p>Modeled Price: {(Math.round((100*Number(this.state.modelprice))))/100}kr/kWh</p>
                        <p>To Battery Ratio: {Math.round(100*100*Number(this.state.batteryRatio))/100}%</p>
                    </label>
                    <button type="submit">Refresh</button>
                </form>
                <div className="actions">
                    <form onSubmit={this.handlelogout}> 
                        <button type="submit">Logout</button>
                    </form>
                    <div className="change">
                        <form onSubmit={this.powerPlantSubmit}>
                            <button type="submit">Toggle Powerplant Power</button>
                        </form>
                        <form onSubmit={this.handleSubmitbat}>
                            <label>
                                <p>New To Battery Ratio:{Math.round(100*Number(this.state.newbatratio))}%</p>  <p>  <Slider
                                    axis="x"
                                    xstep={0.05}
                                    xmin={0}
                                    xmax={1}
                                    x={this.state.newbatratio}
                                    onChange={({ x }) => this.setState({ newbatratio: Math.round(100* parseFloat(x.toFixed(2)))/100 })}
                                /></p>
                            </label>

                            <button type="submit">Change</button>
                        </form>
                        <form onSubmit={this.handlePriceSubmit}>
                            <label>
                                <p>New Price<input type="text" name="price" onChange={this.handleChangePrice}/></p>
                            </label>

                            <button type="submit">Change</button>
                        </form>
                    </div>
                </div>
            </div>);
        }
    }}

};
/* <p>ConsumeChange:<input type="text" name="consume"onChange={this.handleChangeconsume}/></p>*/ 
/* BatteryChange:<input type="text" name="battery"onChange={this.handleChangebattery}/>*/ 