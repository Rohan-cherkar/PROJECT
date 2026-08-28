const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.addReview=async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.user=req.user._id;
    // console.log(newReview.user._id)+-
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Submitted ");
    res.redirect(`/listings/${listing.id}#reviews`);
  }

  module.exports.destroyReview=async (req, res) => {
      let { id, reviewId } = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Review is deleted ");
  
      res.redirect(`/listings/${id}#reviews`);
    }