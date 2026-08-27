const mongoose = require("mongoose");
const initdata = require("../init/data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Roamly";

main()
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: "6a8fca21050e1475082607f2",
    }));
    await Listing.insertMany(initdata.data)
    console.log("data was initialized")
}

initDB();