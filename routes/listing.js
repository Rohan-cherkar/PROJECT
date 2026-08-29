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
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/new", isLoggedIn, listingController.newForm);

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    validateListing,
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.postNewListingForm),
  );

// Show Specific Listing
router
  .route("/:id")
  .get(wrapAsync(listingController.getListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.getEditForm),
);

module.exports = router;
