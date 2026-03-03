const blackListTokenModel = require("../models/balcklist.model");
const userModel = require("../models/user.model");


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * @route /api/auth/register
 *@description To Regiser a User
 * @requires (email,password,username)
 */
module.exports.registerUser = async function (req, res) {
  try {
    let { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        message:
          " email, password and username is required to create an account",
        status: "failed",
      });
    }

    const isUserExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExists) {
      return res.status(400).json({
        message: "User Already exists with this username or Email",
        status: "failed",
      });
    }

    let hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error Occured while reigstering a User",
      status: "failed",
      error: error,
    });
  }
};



/**
 * @route /api/auth/login
 * @description To login a User
 */
module.exports.loginUser = async function (req, res) {
  try {
    let { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
        status: "failed",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid Credentials",
            status :"failed"
        })
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "User Logged In successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error Occured while logging In",
      status: "failed",
      error: error,
    });
  }
};



/**
 * @route /api/auth/logout
 *@description To Logout a User
 */
module.exports.logoutUser = async function(req, res){

     const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

     if(!token){
        return res.status(400).json({
            message : "Token Not Found",
            status : "failed"
        })
     }

     await blackListTokenModel.create({
        token
     })

     res.clearCookie("token")

     res.status(200).json({
        message : "User logged Out successfully",
        status : "Success"
     })
}


/**
 * @route /api/auth/profile
 *@description To Get the Profile of a User
 */
module.exports.getProfile = async function(req, res){

     const user = req.user;

     if(!user){
        return res.status(400).json({
            message :" User Not Found ",
            status : "Failed"
        })
     }

     return res.status(200).json({
        message : "User Details Found",
        status :"success",
        user
     })
}