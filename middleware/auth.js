const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const checkAuth = async (req, res, next) => {
  // console.log("Hello Middleware");
  const { token } = req.cookies;
  // console.log(token);
  if (!token) {
    req.flash("error", "UnAuthorized User, Please login!");
    res.redirect('/');
  }
  else {
    const verifyToken = jwt.verify(token, "Prashant@1Gupta");
    // console.log(verifyToken);
    const data = await UserModel.findOne({ _id: verifyToken.ID });
    // console.log(data);
    req.data1 = data;
    
    next();
  }
};

module.exports = checkAuth;