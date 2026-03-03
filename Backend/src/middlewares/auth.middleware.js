const blackListTokenModel = require("../models/balcklist.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.isLoggedIn = async function (req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        message: "Unauthorized Access, Token Not Found",
        status: "failed",
      });
    }

    const isblackListed = await blackListTokenModel.findOne({
      token,
    });
    if (isblackListed) {
      return res.status(400).json({
        message: "Unauthorized Access, BlackListed Token",
        status: "failed",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userModel.findById({
      _id: decoded._id,
    }).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User Not Found with this email",
        status: "failed",
      });
    }

    req.user = user;
     next();
  } catch (error) {
    return res.status(401).json({
      message: "User Not Authorized",
      status: "failed",
      error: error.message,
    });
  }
};
