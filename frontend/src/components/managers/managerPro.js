import React from "react";
import { Redirect } from 'react-router-dom';
import Slider from 'react-input-slider';
import '../prosumers/pro.css'
import axInstance from '../axiosconfig.js';
import Axios from "axios";
export default class ManagerPro extends React.Component{
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
            email: this.props.location.state.email,
            token: this.props.location.state.token,
            newbatratio: null,
            Name: null,
            NewName: null,
            UserName: null,
            NewUserName: null,
            UserEmail: this.props.location.state.User,
            NewEmail: null,
            NewPassword: null,
            nameRes: null,
            emailRes: null,
            usernameRes: null,
            passwordRes: null,
            blocktime: 10,
            blocktimeRes: null,
            image: new FormData(),
            newimage: null,
            imgtest: null,
            impath: '',
            newconratio: "0",
            cases: "stay"
        }
    }

    handleSubmit = event =>{
        event.preventDefault();
        axInstance.get('/home',{
            headers:{
            token: this.state.token,
            email: this.state.UserEmail,
            adminemail: this.state.email,
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
                email: this.state.UserEmail,
                adminemail: this.state.email,
        }}).then(res =>{
            this.setState({batteryRatio: res.data})
        }).catch(function(error) {
        
        })
        };

    handleChangeName= event =>{
        this.setState({NewName:  event.target.value});
    };

    handleChangeUserName= event =>{
        this.setState({NewUserName:  event.target.value});
    };

    handleChangeEmail= event =>{
        this.setState({NewEmail:  event.target.value});
    };

    handleChangePassword= event =>{
        this.setState({NewPassword:  event.target.value});
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
                email: this.state.UserEmail,
                adminemail: this.state.email,
        } }).then(res =>{
            this.setState({consumeRatio: res.data.consumeRatio})
        }).catch(function(error) {
            
        })
    };

    handleRefresh(){
        this.setState({impath: 'http://130.240.200.61:5000/pictures/'+this.state.UserName + '?'+Date.now()})
        axInstance.get('/credentials',{
            headers:{
                token: this.state.token,
                email: this.state.UserEmail,
                adminemail: this.state.email,
        }}).then(res =>{
            this.setState({Name: res.data.fullname})
            this.setState({UserName: res.data.username})
            this.setState({Useremail: res.data.email})
        }).catch(function(error) {
    
        })
        axInstance.get('/home',{
            headers:{
                token: this.state.token,
                email: this.state.UserEmail,
                adminemail: this.state.email,
        }}).then(res =>{
            this.setState({production: res.data.production});
            this.setState({consumption: res.data.consumption});
            this.setState({buffer: res.data.buffer});
            this.setState({batteryRatio: res.data.batteryRatio});
            this.setState({consumeRatio: res.data.consumeRatio});
            this.setState({wind: res.data.wind});
            this.setState({price: res.data.price});
            if(res.data.sellblocked == false)
            {
                this.setState({blocktimeRes: 0})
            }
        }).catch(function(error) {
         
        })
    };

    handleSubmitcredName= event =>{
        event.preventDefault()
        axInstance.put('/credentials/fullname',{fullname: this.state.NewName, email: this.state.UserEmail},{
            headers:{
                token: this.state.token,
                adminemail: this.state.email,
        } }).then(res =>{
            this.setState({nameRes: res.data})
            
        }).catch(function(error) {
    
        })

    };

    handleSubmitcredUserName= event =>{
        event.preventDefault()
        axInstance.put('/credentials/username',{username: this.state.NewUserName, email: this.state.UserEmail},{
            headers:{
                token: this.state.token,
                adminemail: this.state.email,
        }}).then(res =>{
            if(res.status === 500){
                this.setState({usernameRes: res.message})
            }
            else{
                this.setState({usernameRes: res.data})
            }
        }).catch(function(error) {
    
        })
       
        
    };

    handleSubmitcredEmail= event =>{
        event.preventDefault()
    };

    handleSubmitcredPassword= event =>{
        event.preventDefault()
        axInstance.put('/credentials/password',{password: this.state.NewPassword, email: this.state.UserEmail},{
            headers:{
                token: this.state.token,
                adminemail: this.state.email,
        }}).then(res =>{
            if(res.status === 500){
                this.setState({passwordRes: res.message})
            }
            else{
                this.setState({passwordRes: res.data})
            }
        }).catch(function(error) {
    
        })
       
    };

    handleSubmitGback= event =>{
        event.preventDefault()
        this.setState({cases: "gomanager"})
    };

    handleSubmitBlock= event =>{
        event.preventDefault()
        if(this.state.blocktimeRes == 0){
            axInstance.put('/sellBlock',{seconds: this.state.blocktime, email: this.state.UserEmail},{
                headers:{
                    token: this.state.token,
                    adminemail: this.state.email,
            } }).then(res =>{
                this.setState({blocktimeRes: res.data.seconds})
                
            }).catch(function(error) {
        
            });
        }

    };
    handleSubmitDelete= event =>{
        event.preventDefault()
        axInstance.delete('/users',{
            headers:{
                token: this.state.token,
                adminemail: this.state.email,
        }, data:{email: this.state.UserEmail}}).then(res =>{
            if(res.status == 200 || res.status == 304)
            {
                this.setState({cases: "gomanager"})
            }
            
        }).catch(function(error) {
    
        });
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
                    email: this.state.UserEmail,
                    adminemail: this.state.email,
                    token: this.state.token,
                    thistype: ('.' + typeimg[typeimg.length-1]),
            }}).then(res =>{
            }).catch(function(error) {

            })
            this.setState({impath: 'http://130.240.200.61:5000/pictures/'+this.state.UserName + '?'+Date.now()})
        }
    };
                
                
        
    
    componentDidMount(){
        this.handleRefresh()
        this.interval = setInterval(() => this.handleRefresh(), 10000);
    };
    componentWillUnmount(){
        clearInterval(this.interval);
    };
  
   

    render(){
        switch(this.state.cases){

            case "login": {
                return <Redirect to={{pathname:"/", state: { token: this.state.token, email: this.state.email}}}/> 
            }
            case "gomanager":{
                return <Redirect to={{pathname:"/admin", state: { token: this.state.token, email: this.state.email}}}/> 
            }
            default:{
        return(
            <div className="all">
                <div className="actions">
                    <p>Admin Actions</p>
                    <div className="change">
                        <form onSubmit={this.handleSubmitBlock} className="info2">
                            <label>
                                <p>Block Account</p>
                                <p>Blocked for: {this.state.blocktimeRes} seconds</p>
                                <p>Time:{this.state.blocktime}sec</p>  
                                <p> <Slider
                                axis="x"
                                xstep={1}
                                xmin={10}
                                xmax={100}
                                x={this.state.blocktime}
                                onChange={({ x }) => this.setState({ blocktime: parseFloat(x.toFixed(0))})}
                                /></p>
                            </label>
                            <button type="submit">Block</button>
                        </form>
                        <form onSubmit={this.handleSubmitDelete} className="info2">
                            <label>
                            <p>Delete Account</p>
                            </label>
                            <button type="submit">Delete</button>
                        </form>
                        <form onSubmit={this.handleSubmitGback} className="info2">
                            <label>
                            <p>Back to Manager page</p>
                            </label>
                            <button type="submit">Go</button>
                        </form>
                    </div>
                </div>
                <div className="actions">
                    <p>Change User Credentials</p>
                    <div className="change">
                        <form onSubmit={this.handleSubmitcredName} className="info2">
                            <label>
                                <p>Name: {this.state.Name}</p>
                                <p>Update Status: {this.state.nameRes}</p>
                                <p>New Name: <input type="text" name="price" onChange={this.handleChangeName}/></p>
                            </label>
                            <button type="submit">Update Name</button>
                        </form>
                        <form onSubmit={this.handleSubmitcredUserName} className="info2">
                            <label>
                                <p>Username: {this.state.UserName}</p>
                                <p>Update Status: {this.state.usernameRes}</p>
                                <p>New User Name: <input type="text" name="price" onChange={this.handleChangeUserName}/></p>
                            </label>
                            <button type="submit">Update Username</button>

                        </form>

                        <form onSubmit={this.handleSubmitcredPassword} className="info2">
                            <label>
                                <p>Update Status: {this.state.passwordRes}</p>
                                <p>New Password<input type="text" name="price" onChange={this.handleChangePassword}/></p>
                            </label>
                            <button type="submit">Update Password</button>
                        </form>
                    </div>
                </div>
                <div className="actions">
                    <p>User info</p>
                    <form onSubmit={this.handleSubmit} className="info">
                        <label>
                            <p>Email: {this.state.UserEmail}</p>
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
                </div>
                <div className="change">
                    <form onSubmit={this.handleSubmitbat}>
                        <label>
                            <p>New To Battery Ratio:{Math.round(100*Number(this.state.newbatratio))}%</p>  
                            <p><Slider
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
                    <form onSubmit={this.handleSubmitconsume}>
                        <label>
                            <p>New From Battery Ratio:{Math.round(100*Number(this.state.newconratio))}%</p>  
                            <p><Slider
                                axis="x"
                                xstep={0.05}
                                xmin={0}
                                xmax={1}
                                x={this.state.newconratio}
                                onChange={({ x }) => this.setState({ newconratio: Math.round(100* parseFloat(x.toFixed(2)))/100 })}
                            /></p>
                        </label>
                        <button type="submit">Change</button>
                    </form>
                    <form onSubmit={this.handleImage} className="info2">
                        <img className="houseimg" src={this.state.impath} alt="House picture"/>
                        <input type="file" onChange={this.fileselectHandler}></input>
                        <button type="submit">Upload</button>
                    </form>
                </div>
            </div>);
        }}
    }

};
/* <p>ConsumeChange:<input type="text" name="consume"onChange={this.handleChangeconsume}/></p>*/ 
/* BatteryChange:<input type="text" name="battery"onChange={this.handleChangebattery}/>*/ 