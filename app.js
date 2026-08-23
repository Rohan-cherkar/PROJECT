const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.engine("ejs", ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/Roamly";
main()
  .then(() => {
    console.log("connected to DB(Roamly)");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.send("hello");
});


// express errors Page not Found if user try to access random page
app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error.ejs", { err });
});

const port = 3000;
app.listen(port, () => {
  console.log("Listerning....");
});
