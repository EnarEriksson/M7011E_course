import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axInstance from './axiosconfig.js';
export default class AdminLogin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
             email : '',
             password: '',
             response: "",
             responsetext: "",
             cases: "stay"
        };
    }
    handleChangeemail = event =>{
        this.setState({email: event.target.value});
    }
    handleChangepassword = event =>{
        this.setState({password: event.target.value});
    }
    handleSubmitReg = event =>{
        this.setState({cases: "user"})
    }
    handleSubmit = event =>{
        event.preventDefault();
        this.setState({responsetext: "BAD EMAIL OR PASSWORD"})
        axInstance.post('manager/login', {
            email: this.state.email,
            password: this.state.password
        }).then(res =>{
            if(res.status === 200){
                console.log('Successfully Login');
                this.setState({response: res.data.token});
                this.setState({cases: "logged"})
            }
            this.setState({responsetext: res.statusText});
                
        }).catch(function(error) {

        })
    };

    componentDidMount(){
        console.log("hej")
    };

    componentWillUnmount(){
        console.log("hejdå")
    };
  
    
    render() {
        switch(this.state.cases){

            case "logged": {
                return <Redirect to={{pathname:"/admin", state: { token: this.state.response, email: this.state.email}}}/> 
            }
            case "user":{
                return(<Redirect to={{pathname:"/"}}/> )
            }
            
            default:{
                return (
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                <p>EMAIL: <input type="text" name="email" onChange={this.handleChangeemail}/></p>
                                <p>PASSWORD: <input type="password" name="password"onChange={this.handleChangepassword}/></p>
                            </label>
                            <button type="submit">Login</button>
                            <p><div>{this.state.responsetext}</div></p>
                        </form>
                        <form onSubmit={this.handleSubmitReg}>
                            <button type="submit">User Login</button>
                        </form>
                    </div>
                    )
            }
        }
    }
}
