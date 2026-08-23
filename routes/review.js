const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
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
const validateListing = (req, res, next) => {
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

// Reviews Route
router.post(
  "/",  // this will five error i we do not use mergeParams:true it will give pagenot found 
  validateReview,
  wrapAsync(async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing.id}`);
  }),
);

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }),
);

module.exports=router;