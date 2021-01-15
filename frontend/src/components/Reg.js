import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axInstance from './axiosconfig.js';
export default class Reg extends React.Component{
    constructor(props){
        super(props);
            this.state = {
                username : "default",
                email : "default",
                password: "default",
                fullname: "default",
                response: "",
                responsetext: "",
                isprosumer: "false",
                cases: "stay"
            }
    };
    handleChangeemail = event =>{
        this.setState({email: event.target.value});        
    }
    handleChangepassword = event =>{
        this.setState({password: event.target.value});
    }
    handleChangeuser = event =>{
        this.setState({username: event.target.value});
    }
    handleChangefullname = event =>{
        this.setState({fullname: event.target.value});
    }
    handleChangepro = event =>{
        this.setState({isprosumer: event.target.value});
    }
    handleSubmitLogin = event =>{
        event.preventDefault();
        this.setState({cases: "login"});
    }
    handleSubmit = event =>{
        event.preventDefault();
        this.setState({responsetext: "BAD EMAIL OR PASSWORD OR USERNAME"})
        axInstance.post('user/register', {
            username: this.state.username, 
            fullname:  this.state.fullname,
            email: this.state.email,
            password: this.state.password,
            isprosumer: this.state.isprosumer
        }).then(res =>{
            if(res.status === 200){             
                this.setState({response: res.data.token});
                this.setState({responsetext: res.statusText});
                this.setState({cases: "logged"})
            }
        }).catch(function(error) {

        })
              
    };
        
    render() {
        switch(this.state.cases){

            case "logged": {
                return (<Redirect to={{pathname:"/pro", state: { token: this.state.response, email: this.state.email}}}/> )
            }
            case "login":{
                return(<Redirect to={{pathname:"/"}}/> )
            }
            
            default:{
                return (
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                
                                <p>Email:<input type="text" name="Email" onChange={this.handleChangeemail}/></p>
                                <p>Fullname:<input type="text" name="Fullname"onChange={this.handleChangefullname}/></p>
                                <p>Username:<input type="text" name="Username" onChange={this.handleChangeuser}/></p>
                                <p>Password:<input type="password" name="Password"onChange={this.handleChangepassword}/></p>
                                <select value={this.state.isprosumer} onChange={this.handleChangepro}>
                                    <option value = "true">Prosumer</option>
                                    <option value = "false">not a Prosumer</option>
                                </select>
                                    
                            </label>
                            <button type="submit">Register</button>
                            <p><div>{this.state.responsetext}</div></p>
                        </form>
                        <form onSubmit={this.handleSubmitLogin}>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                    
                )
            }
        }
    }
}