const { model } = require("mongoose");
const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Registered Successfully");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Login Successfully ");
  if (res.locals.redirectUrl) {
    res.redirect(res.locals.redirectUrl); // checks whether there is any existing path
  } else {
    res.redirect("/listings");
  }
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      //not necessary
      return next();
    }
    req.flash("success", "Logout successfully");
    res.redirect("/listings");
  });
};