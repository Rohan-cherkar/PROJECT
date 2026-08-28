const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const { validateReview } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// Reviews Route
router.post(
  "/", // this will five error i we do not use mergeParams:true it will give pagenot found
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addReview),
);

router.delete(
  "/:reviewId",
  // validateReview,
  isLoggedIn,
  wrapAsync(reviewController.destroyReview),
);

module.exports = router;
