const express = require("express");
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const simulatorManager = require('../simulator/simulatorManager');


const Manager = require("../schemas/manager");
const { NotExtended } = require("http-errors");


router.post(
    "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 6
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { email, password } = req.body;
      try {
        let manager = await Manager.findOne({
          email
        });
        if (!manager)
          return res.status(400).json({
            message: "Could not find a user with the given e-mail"
          });
  
        const isMatch = await bcrypt.compare(password, manager.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password!"
          });
  
        const payload = {
          manager: {
            id: manager.id
          }
        };
  
        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token
            });
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
  );

module.exports = router;