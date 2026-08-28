const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.postNewListingForm = async (req, res, next) => {
  // let {title,description,image,price,location,country}=req.body;
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  // console.log(listing);
  await listing.save();
  req.flash("success", "New Listing Created !!");
  res.redirect("/listings");
};

module.exports.getListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "user" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist :( ");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.getEditForm = async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist :( ");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing is deleted ");
  res.redirect("/listings");
};
