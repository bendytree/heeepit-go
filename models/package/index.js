
var mongoose = require("mongoose");

module.exports = Package = mongoose.model("Package", mongoose.Schema({
  name: "string",
  description: "string",
  type: "string",
  src: "string",
  website: "string",
  dependencies: ["string"],
  code: "string",
  createdOn: { type: Date, default: Date.now }
}));

mongoose.connect("localhost", "scriptsmash", function(err, db) {
  if(err) {
      console.log("Error connecting to db: "+err);
  }else{
      console.log("db connection succeeded");

      require("importer")(Package);
  }
});

