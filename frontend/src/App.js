import './App.css';
import logo2 from './logo.svg';
import logo from './windkraft2.png';
import Reg from './components/Reg';
import Frontlogin from './components/frontlogin';
import Prosumer from './components/prosumers/prosumer';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import { Component } from 'react';
import history from './components/history';
import axInstance from './components/axiosconfig.js';
import Manager from './components/managers/manager';
import AdminLogin from './components/AdminLogin';
import ManagerPro from './components/managers/managerPro'
import { Redirect } from 'react-router-dom';


export default class App extends Component{
  constructor(){
    super();
    this.state ={
      token: null,
      turbine: "App-logo",
      wind: null,
    }
  }
handleTurbinespeed(){
  axInstance.get('/wind')
.then(res =>{
    if(Number(res.data) >= 5){
      this.setState({turbine: "App-logo1"})
      }
      else if(Number(res.data) < 5 && Number(res.data)>=2)
      {
        this.setState({turbine: "App-logo"})
      }
      else
      {
        this.setState({turbine: "App-logo3"})
      }
    this.setState({wind: res.data})
    
}).catch(function(error) {

})



};

componentDidMount(){
  console.log("mounted")
  document.title = "Green Lean Electrics"
   this.handleTurbinespeed()
   this.interval1 = setInterval(() => this.handleTurbinespeed(), 5000);
   }
componentWillUnmount(){
        
  clearInterval(this.interval1);     
  console.log("hejdå")
}

render(){
  return (<div className="App">
  <header className="App-header">

    <img src={logo} className={this.state.turbine} alt="logo" />
    <p>Current wind: {(Math.round((10*Number(this.state.wind))))/10}m/s</p>
    <BrowserRouter history={history}>
    <Switch>
      <Route exact path={"/"} render={props=>(
        <Frontlogin {...props}/>
      )}/>
      <Route exact path={"/reg"} render={props=>(
        <Reg {...props}/>
      )}/>
      <Route exact path={"/adminLogin"} render={props=>(
        <AdminLogin {...props}/>
      )}/>
     <ProtectedRoute
    path="/pro"
    component={Prosumer}
    />
    <ProtectedRoute
    path="/admin"
    component={Manager}
    />
    <ProtectedRoute
    path="/Managerpro"
    component={ManagerPro}
    />
      <Redirect to="/" />
    </Switch>
    </BrowserRouter>
  </header>

</div>
);}
}
const ProtectedRoute =  ({component: Comp, loggedIn, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        return (typeof props.location.state !== "undefined") ? <Comp {...props} /> : <Redirect to="/" />;
      }}
    />
  );
};
// <Route exact path={"/pro"} render={props=>(
 // <Prosumer {...props}/>
  //)}/>
 // <Route exact path={"/Managerpro"} render={props=>(
 //   <ManagerPro {...props}/>
  //  
 // )}/>
 // <Route exact path={"/admin"} render={props=>(
 //   <Manager {...props}/>
//  )}/>