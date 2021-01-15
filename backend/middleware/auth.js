
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const Manager = require("../schemas/manager");


module.exports = async(req, res, next) => {
  const token = req.header("token");
  var email = req.header("email");
  if (!token){
    console.log("no token");
    return res.status(401).json({ message: "Auth Error" });
  } 

  try {
    const decoded = jwt.verify(token, "randomString");
    if(decoded.manager !== undefined){
      email = req.header("adminemail");
      const manager = await Manager.findById(decoded.manager.id);
      if(email === manager.email){
        req.manager = decoded.manager;
        next();
        return;
      }
    }
    req.user = decoded.user;
    const user = await User.findById(decoded.user.id);
    if(email !== user.email) {
      console.log("mismatched token");
      return res.status(401).json({ message: "Auth Error" });
    }
    console.log("authenticated user: " + user.username);
    next();
  } catch (e) {
    //console.error(e);
    console.log("token error probably");
    res.status(500).send({ message: "Invalid Token" });
  }
  
};
