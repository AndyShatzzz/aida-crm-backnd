const mongoose = require("mongoose");

const productsListSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  counter: {
    type: Number,
  },
  cost: {
    type: Number,
  },
  price: {
    type: Number,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    reference: "product",
  },
});

// const stateSchema = new mongoose.Schema({
//   name: {
//     type: String,
//   },
//   quantity: {
//     type: String,
//   },
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     reference: 'product',
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     reference: 'user',
//   },
// });

const stateSchema = new mongoose.Schema({
  cheque: [productsListSchema],
  totalCost: {
    type: Number,
    required: true,
  },
  prevOwner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    reference: "user",
  },
});

const updatedStateSchema = new mongoose.Schema({
  cheque: [productsListSchema],
  totalCost: {
    type: Number,
  },
  cash: {
    type: Number,
  },
  card: {
    type: Number,
  },
  updatedOwner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    reference: "user",
  },
});

const chequeSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
  },
  status: {
    type: String,
  },
  productsList: {
    cheque: [productsListSchema],
    totalCost: {
      type: Number,
    },
    cash: {
      type: Number,
    },
    card: {
      type: Number,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    reference: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  prevState: [stateSchema],
  updatedState: [updatedStateSchema],
});

module.exports = mongoose.model("cheque", chequeSchema);
