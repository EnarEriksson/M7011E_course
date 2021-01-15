const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");

const path = require('path');
const fs = require('fs');

const multer = require('multer');
const User = require('../schemas/user');

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, '/images');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname);
  }
});

const upload = multer({dest: 'uploads/'});

router.post('/', auth,  upload.single('file'), async (req, res) => {
    console.log(req.file.filename);
    if (!req.file) {
      console.log("No file received");
      return res.send({
        success: false
      });
  
    } else {
      const filename = req.file.filename;
      const filetype = req.header('thistype');;
      console.log('file received, filename: ' + filename + " filetype: " + filetype);
      fs.rename('uploads/' + filename, 'uploads/' + filename + filetype, function(err) {
        if(err) console.log("saved failing file: " + filename + filetype);
      });
      const email = req.header('email');
      const user = await User.findOne({email: email});
      if(user.picture){
        var path = "uploads/" + user.picture;
        fs.unlink(path, (err) => {
          if(err){
            console.error(err);
            return;
          } 
        })
      }
      user.picture = filename + filetype;
      await user.save();
      return res.send({
        success: true
      })
    }
  });

  router.get('/:username', async (req, res) => {
    try{
      const username = req.params.username;
      console.log("getting picture for " + username);
      const user = await User.findOne({username: username});
      const filename = user.picture;
      if(!user) return res.status(404).send({message: "User not found"});
      if(!user.picture) return res.status(404).send({message: "Image not found"});
      res.sendFile(path.resolve("uploads/" + filename)); 
    }
    catch (e) {
      console.error(e);
      //console.log("failed to load image");
      res.status(500).send({ message: "failed to load image" });
    }

  });

module.exports = router;