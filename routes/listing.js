const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  validateReview,
} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(validateListing, wrapAsync(listingController.postNewListingForm));

// Show Specific Listing
router
  .route("/:id")
  .get(wrapAsync(listingController.getListing))
  .put(
    isLoggedIn,
    validateListing,
    isOwner,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get("/new", isLoggedIn, listingController.newForm);

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.getEditForm),
);

module.exports = router;
