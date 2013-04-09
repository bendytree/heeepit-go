
var mongoose = require("mongoose");
var importer = require("./importer");
var config = require('../config');

module.exports = Package = mongoose.model("Package", mongoose.Schema({
  name: "string",
  description: "string",
  type: "string",
  srcUrl: "string",
  website: "string",
  dependencies: ["string"],
  code: "string",
  createdOn: { type: Date, default: Date.now }
}));


mongoose.connect(config.mongourl, function (err, db) {
  if(err) {
      console.log("Error connecting to db: "+err);
  }else{
      console.log("db connection succeeded");

      importer.import(Package);
  }
});

