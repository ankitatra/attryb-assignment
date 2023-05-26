const authRouter = require("express").Router();
const {
  registerController,
  loginController,
} = require("../controller/user.controller");

const { body } = require("express-validator");

authRouter.route("/register").post(
  [
    body("username", "Enter your username").not().isEmpty(),
    body("email", "Enter a vaild email").isEmail(),
    body("password", "Password length must be atleast 3").isLength({
      min: 3,
    }),
   
  ],
  registerController
);

authRouter.route("/login").post(
  [
    body("email", "Enter a vaild email").isEmail(),
    body("password", "Password length must be atleast 3").isLength({
      min: 3,
    }),
  ],
  loginController
);

module.exports = {
  authRouter,
};
