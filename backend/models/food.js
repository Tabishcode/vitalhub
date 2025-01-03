const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for individual food items
let foodItemSchema = new Schema({
  day: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ], // Valid days
  },
  mealType: {
    type: String,
    required: true,
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks"], // Valid meal types
  },
  name: {
    type: [String], // Array of food names
    required: true,
  },
  calories: {
    type: [Number], // Array of calorie values
  },
  proteins: {
    type: [Number], // Array of protein values
  },
  carbs: {
    type: [Number], // Array of carb values
  },
  fats: {
    type: [Number], // Array of fat values
  },
  sugars: {
    type: [Number], // Array of sugar values
  },
});

// Define the schema for the time table
let timeTableSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true, // Ensures each clerkId is unique in the collection
  },
  timeTable: {
    type: [foodItemSchema], // Array of food entries
    required: true,
  },
});

// Create the model
let TimeTable = mongoose.model("TimeTable", timeTableSchema);

module.exports = TimeTable;
