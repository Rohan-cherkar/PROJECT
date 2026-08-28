const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js")
const {validateReview}=require(("../middleware.js"))


// Reviews Route
router.post(
  "/", // this will five error i we do not use mergeParams:true it will give pagenot found
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.user=req.user._id;
    // console.log(newReview.user._id)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Submitted ");
    res.redirect(`/listings/${listing.id}#reviews`);
  }),
);

router.delete(
  "/:reviewId",
  // validateReview,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is deleted ");

    res.redirect(`/listings/${id}#reviews`);
  }),
);

module.exports = router;
