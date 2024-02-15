const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    // require: true,
    minlength: 2,
    maxlength: 30,
  },
  quantity: {
    type: Number,
    // require: true,
  },
  price: {
    type: Number,
    // require: true,
  },
  image: {
    type: String,
    default:
      "https://papik.pro/uploads/posts/2021-11/thumbs/1636161187_37-papik-pro-p-yabloko-logotip-foto-38.png",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    reference: "user",
  },
});

module.exports = mongoose.model("product", productSchema);
