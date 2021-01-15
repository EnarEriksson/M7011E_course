const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const managerAuth = require("../middleware/managerAuth");
const simulatorManager = require('../simulator/simulatorManager');
const getGredentials = require('../middleware/getCredentials');
const credentials = require('../middleware/credentials');
const Manager = require('../schemas/manager') 



router.get('/price', simulatorManager.getPrice);

router.get('/wind', simulatorManager.getWind);

router.get('/home', auth, simulatorManager.getHome);

router.put('/batteryRatio', auth, simulatorManager.setBatteryRatio);

router.put('/consumeRatio', auth, simulatorManager.setConsumeRatio);

router.get('/plantInfo', managerAuth, simulatorManager.getPlantInfo);

router.put('/price', managerAuth, simulatorManager.setPrice);

router.put('/plantRatio', managerAuth, simulatorManager.setPlantRatio);

router.put('/plantState', managerAuth, simulatorManager.setPlantState);

router.get('/blackouts', managerAuth, simulatorManager.getBlackOuts);

router.get('/users', managerAuth, simulatorManager.getAllUsers);

router.get('/credentials', managerAuth, getGredentials);

router.put('/credentials/username', managerAuth, credentials.setUserName);

router.put('/credentials/fullname', managerAuth, credentials.setFullName);

router.put('/credentials/password', managerAuth, credentials.setPassWord);

router.put('/sellBlock', managerAuth, simulatorManager.sellBlock);

router.delete('/users', managerAuth, simulatorManager.deleteUser);


router.get('/adminCredentials', managerAuth, async (req, res) => {
  const email = req.header("adminemail");
  const manager = await Manager.findOne({email: email});
  const username = manager.username;
  const fullname = manager.fullname;
  res.send({
    username: username,
    fullname: fullname
  });
});



module.exports = router;