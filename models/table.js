const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    require: true,
  },
  x: {
    type: Number,
    require: true,
  },
  y: {
    type: Number,
    require: true,
  },
  width: {
    type: Number,
    require: true,
  },
  height: {
    type: Number,
    require: true,
  },
  id: {
    type: Number,
    require: true,
  },
});

const tablesSchema = new mongoose.Schema({
  tables: [tableSchema],
});

module.exports = mongoose.model("table", tablesSchema);
