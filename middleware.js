const Listing=require("./models/listing")

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
