const jwt = require("jsonwebtoken");
const Manager = require("../schemas/manager");


module.exports = async(req, res, next) => {
  const token = req.header("token");
  var email = req.header("adminemail");
  if (!token){
    console.log("no token");
    return res.status(401).json({ message: "Auth Error" });
  } 

  try {
    const decoded = jwt.verify(token, "randomString");
    if(decoded.manager !== undefined){
      const manager = await Manager.findById(decoded.manager.id);
      if(email === manager.email){
        req.manager = decoded.manager;
        console.log("manager authenticated " + manager.email);
        next();
        return;
      }
    }
  } catch (e) {
    //console.error(e);
    console.log("token error probably");
    res.status(500).send({ message: "Invalid Token" });
  }
  
};