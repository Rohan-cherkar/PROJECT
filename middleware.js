const Listing=require("./models/listing")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path,"...." ,req.originalUrl);
  if (!req.isAuthenticated()) {
    // this saves the path that user try to access before login
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please Login");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have access to edit ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  //currently nort in use
  // console.log(listingSchema);
  let { error } = listingSchema.validate(req.body);
  if (error) {
    // console.log(error);
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  //currently nort in use
  // console.log(listingSchema);
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    // console.log(error);
    throw new ExpressError(400, error);
  } else {
    next();
  }
};