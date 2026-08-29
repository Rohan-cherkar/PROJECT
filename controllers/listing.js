const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let allListings;
  if (category) {
    const keywordMap = {
      Trending: /trending|luxur|penthouse|island|villa|private/i,
      Rooms: /room|loft|apartment|condo|suite|brownstone|house/i,
      Mountains: /mountain|chalet|ski|alps|rockies|highland|peak/i,
      "Iconic Cities": /city|downtown|penthouse|tokyo|boston|miami|new york|amsterdam|dubai|los angeles|florence/i,
      Beach: /beach|coast|ocean|sea|bay|malibu|cancun|bali|greece|mykonos|phuket|maldives/i,
      Forts: /fort|castle|historic|tuscany|villa|brownstone|palace/i,
      Swimming: /swimming|pool|beach|island|water|lake|villa|maldives/i,
      Camping: /camp|treehouse|nature|eco|forest|cabin|cottage|log/i,
      Farms: /farm|cottage|countryside|ranch|nature|cotswolds/i,
      Cruse: /cruse|cruise|boat|ship|island|maldives|yacht|lake/i,
    };

    const regexPattern = keywordMap[category] || new RegExp(category, "i");
    allListings = await Listing.find({
      $or: [
        { category: category },
        { title: { $regex: regexPattern } },
        { description: { $regex: regexPattern } },
        { location: { $regex: regexPattern } },
        { country: { $regex: regexPattern } },
      ],
    });
  } else {
    allListings = await Listing.find({});
  }
  res.render("listings/index.ejs", { allListings, category });
};

module.exports.newForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.postNewListingForm = async (req, res, next) => {
  // let {title,description,image,price,location,country}=req.body;
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, filename);
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image.url = url;
  listing.image.filename = filename;
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
  let originalImg=listing.image.url
  originalImg.replace("/upload","/upload/h_300,w_250")
  res.render("listings/edit.ejs", { listing, originalImg });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing is deleted ");
  res.redirect("/listings");
};
