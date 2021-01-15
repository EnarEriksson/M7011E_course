const User = require("../schemas/user");

module.exports = async (req, res) => {
    const email = req.header("email");
    const user = await User.findOne({email: email});
    const username = user.username;
    const fullname = user.fullname;
    res.send({
        username: username,
        fullname: fullname,
        email: email
    });
};