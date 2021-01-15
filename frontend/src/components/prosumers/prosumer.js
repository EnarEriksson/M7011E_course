import React from "react";
import { Redirect } from 'react-router-dom';
import Slider from 'react-input-slider';
import './pro.css'
import axInstance from '../axiosconfig.js';
import ImageUploader from 'react-images-upload';
export default class Prosumer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            wind: null,
            production: null,
            consumption: null,
            buffer: null,
            price:null,
            batteryRatio: null,
            consumeRatio: null,
            username: null,
            email: this.props.location.state.email,
            token: this.props.location.state.token,
            newbatratio: null,
            image: new FormData(),
            newimage: null,
            imgtest: null,
            impath: '',
            imhash: null,
            newconratio: "0",
            cases: "stay"
        }
    }

    handleSubmit = event =>{
        event.preventDefault();
        axInstance.get('/home',{
            headers:{
            token: this.state.token,
            email: this.state.email,
        }}).then(res =>{
            this.setState({production: res.data.production});
            this.setState({consumption: res.data.consumption});
            this.setState({buffer: res.data.buffer});
            this.setState({batteryRatio: res.data.batteryRatio});
            this.setState({consumeRatio: res.data.consumeRatio});
            this.setState({wind: res.data.wind});
            this.setState({price: res.data.price});
        }).catch(function(error) {
    
        })
    };

    handleSubmitbat = event =>{
        event.preventDefault();
        axInstance.put('/batteryRatio',{batteryRatio: this.state.newbatratio},{
                headers:{
                token: this.state.token,
                email: this.state.email,
            } }).then(res =>{
                this.setState({batteryRatio: res.data})
            }).catch(function(error) {
        
            })
    };

    handleChangebattery= event =>{
        this.setState({newbatratio:  Math.round(100*event.target.value)/100});
    }

    handleChangeconsume= event =>{
        this.setState({newconratio:  Math.round(100*event.target.value)/100});
    }

    handleSubmitconsume= event =>{
        event.preventDefault();
        axInstance.put('/consumeRatio',{consumeRatio: this.state.newconratio},{
            headers:{
                token: this.state.token,
                email: this.state.email,
            } }).then(res =>{
                this.setState({consumeRatio: res.data.consumeRatio})
            }).catch(function(error) {
            
            })
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
        axInstance.post('/pictures', formd,{
            headers:{
                email: this.state.email,
                token: this.state.token,
                thistype: ('.' + typeimg[typeimg.length-1]),
            }}).then(res =>{
                }).catch(function(error) {

                })
                this.setState({impath: 'http://130.240.200.61:5000/pictures/'+this.state.username + '?'+Date.now()})
            }
    };

    handlelogout=event=>{
        event.preventDefault();
        this.setState({cases: "login"})
    }
    handleRefresh(){
        axInstance.get('/home',{
            headers:{
            token: this.state.token,
            email: this.state.email,
        }}).then(res =>{
            this.setState({username: res.data.username})
            this.setState({production: res.data.production});
            this.setState({consumption: res.data.consumption});
            this.setState({buffer: res.data.buffer});
            this.setState({batteryRatio: res.data.batteryRatio});
            this.setState({consumeRatio: res.data.consumeRatio});
            this.setState({wind: res.data.wind});
            this.setState({price: res.data.price});
         
        }).catch(function(error) {
    
        })
        this.setState({impath: 'http://130.240.200.61:5000/pictures/'+this.state.username + '?'+Date.now()})
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
            return <Redirect to={{pathname:"/"}}/> 
        }
        default:{
        return(
        <div className="all">
            <form onSubmit={this.handleImage} className="info">
                <img className="houseimgpro" src={this.state.impath} alt="House picture"/>
                <input type="file" onChange={this.fileselectHandler}></input>
                <button type="submit">Upload</button>
            </form>
            <form onSubmit={this.handleSubmit} className="info">
                <label>
                
                    <p>Email: {this.state.email}</p>
                    
                    <p>Current Production: {(Math.round((10*Number(this.state.production))))/10}kWh</p>
                    <p>Net Production: {(Math.round((10*(Number(this.state.production)-Number(this.state.consumption)))))/10}kWh</p>
                    <p>Current Consumption: {(Math.round((10*Number(this.state.consumption))))/10}kWh</p>
                    <p>Buffer Size: {(Math.round((10*Number(this.state.buffer))))/10}kWh</p>
                    <p>Price: {(Math.round((100*Number(this.state.price))))/100}kr/kWh</p>
                    <p>To Battery Ratio: {Math.round(100*100*Number(this.state.batteryRatio))/100}%</p>
                    <p>From Battery Ratio: {Math.round(100*100*Number(this.state.consumeRatio))/100}%</p>
                </label>
                <button type="submit">Refresh</button>
        </form>
        <div className="actions">
            <form onSubmit={this.handlelogout}> 
                <button type="submit">Logout</button>
            </form>
            <div className="change">
                <form onSubmit={this.handleSubmitbat}>
                    <label>
                    <p><p>New To Battery Ratio:{Math.round(100*Number(this.state.newbatratio))}%</p>  <p>  <Slider
                        axis="x"
                        xstep={0.05}
                        xmin={0}
                        xmax={1}
                        x={this.state.newbatratio}
                        onChange={({ x }) => this.setState({ newbatratio: Math.round(100* parseFloat(x.toFixed(2)))/100 })}
                    /></p></p>
                    </label>

                    <button type="submit">Change</button>
                </form>
                <form onSubmit={this.handleSubmitconsume}>
                    <label>
                        <p>New From Battery Ratio:{Math.round(100*Number(this.state.newconratio))}%</p>  
                        <p>  
                            <Slider
                                axis="x"
                                xstep={0.05}
                                xmin={0}
                                xmax={1}
                                x={this.state.newconratio}
                                onChange={({ x }) => this.setState({ newconratio: Math.round(100* parseFloat(x.toFixed(2)))/100 })}
                            />
                        </p>
                    </label>

                    <button type="submit">Change</button>
                </form>
            </div>
        </div>
    </div>);
    }}}

};
/* <p>ConsumeChange:<input type="text" name="consume"onChange={this.handleChangeconsume}/></p>*/ 
/* BatteryChange:<input type="text" name="battery"onChange={this.handleChangebattery}/>*/ 