const express = require("express");

const router = express.Router();

const validDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Initialize the database

const TimeTable = require("../models/TimeTable"); // Update with the correct path to your model

router.post("/initialize-food", async (req, res) => {
  const { clerkId } = req.body;

  if (!clerkId) {
    return res.status(400).json({ error: "clerkId is required" });
  }

  const validDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const entries = [];

  try {
    // Create the default time table entries
    validDays.forEach((day) => {
      mealTypes.forEach((mealType) => {
        entries.push({
          day,
          mealType,
          name: [],
          calories: [],
          proteins: [],
          carbs: [],
          fats: [],
          sugars: [],
        });
      });
    });

    // Create a new document with the clerkId and time table entries
    const timeTable = new TimeTable({
      clerkId,
      timeTable: entries,
    });

    // Save to the database
    await timeTable.save();

    res.status(201).json({
      message: "Time table initialized successfully",
      data: timeTable,
    });
  } catch (error) {
    console.error("Error initializing time table:", error);
    res.status(500).json({ error: "Failed to initialize time table." });
  }
});

module.exports = router;


// router.post("/add-food", async (req, res) => {
//   const { day, mealType, name, calories, fats, protein, sugars } = req.body;

//   try {
//     // Validate the day
//     if (!validDays.includes(day)) {
//       return res
//         .status(400)
//         .json({ error: "Invalid day. Use Monday to Sunday." });
//     }

//     // Check if the meal already exists for the day
//     const existingMeal = await FoodItem.findOne({ day, mealType });
//     if (existingMeal) {
//       return res
//         .status(400)
//         .json({ error: "Meal already exists for this day and type." });
//     }

//     // Validate `name` array
//     if (!Array.isArray(name) || name.length === 0) {
//       return res
//         .status(400)
//         .json({
//           error: "The 'name' field must be a non-empty array of strings.",
//         });
//     }

//     // Create and save a new food item
//     const foodItem = new FoodItem({
//       day,
//       mealType,
//       name,
//       calories: calories || 0,
//       fats: fats || 0,
//       protein: protein || 0,
//       sugars: sugars || 0,
//     });

//     await foodItem.save();
//     res
//       .status(201)
//       .json({ message: "Food item added successfully", data: foodItem });
//   } catch (error) {
//     console.error("Error adding food item:", error);
//     res.status(500).json({ error: "Failed to add food item." });
//   }
// });

router.get("/get-food", async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    console.log("Fetched Food Items:", foodItems); // Log the fetched data
    res.status(200).json(foodItems);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ error: "Failed to fetch food items." });
  }
});


// router.delete("/remove-food/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const foodItem = await FoodItem.findById(id);

//     if (!foodItem) {
//       return res.status(404).json({ error: "Food item not found." });
//     }

//     await FoodItem.findByIdAndDelete(id);
//     res.status(200).json({ message: "Food item deleted successfully." });
//   } catch (error) {
//     console.error("Error deleting food item:", error);
//     res.status(500).json({ error: "Failed to delete food item." });
//   }
// });


router.delete("/delete-all-food", async (req, res) => {
  try {
    // Remove all documents from the FoodItem collection
    await FoodItem.deleteMany({});
    res.status(200).json({ message: "All food items deleted successfully." });
  } catch (error) {
    console.error("Error deleting all food items:", error);
    res.status(500).json({ error: "Failed to delete all food items." });
  }
});


router.put("/update-food/:id", async (req, res) => {
  const { id } = req.params;
  const { name, calories, fats, protein, sugars } = req.body;

  try {
    const foodItem = await FoodItem.findById(id);

    if (!foodItem) {
      return res.status(404).json({ error: "Food item not found." });
    }

    // Restrict updates to `day` and `mealType`
    if (req.body.day || req.body.mealType) {
      return res.status(400).json({ error: "Cannot update day or mealType." });
    }

    // Update individual fields
    if (name) {
      if (!Array.isArray(name) || name.length === 0) {
        return res.status(400).json({
          error: "The 'name' field must be a non-empty array of strings.",
        });
      }
      foodItem.name = name;
    }
    if (Array.isArray(calories)) foodItem.calories = calories;
    if (Array.isArray(fats)) foodItem.fats = fats;
    if (Array.isArray(protein)) foodItem.protein = protein;
    if (Array.isArray(sugars)) foodItem.sugars = sugars;

    const updatedFoodItem = await foodItem.save();
    res.status(200).json({
      message: "Food item updated successfully",
      data: updatedFoodItem,
    });
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(500).json({ error: "Failed to update food item." });
  }
});

router.delete("/delete-food/:id", async (req, res) => {
  const { id } = req.params;
  const { foodName } = req.body; // Name of the food to delete

  try {
    const foodItem = await FoodItem.findById(id);

    if (!foodItem) {
      return res.status(404).json({ error: "Food item not found." });
    }

    // Find the index of the food name to delete
    const index = foodItem.name.indexOf(foodName);
    if (index === -1) {
      return res.status(400).json({ error: "Food name not found." });
    }

    // Remove the food name and related data at the same index
    foodItem.name.splice(index, 1);
    foodItem.calories.splice(index, 1);
    foodItem.fats.splice(index, 1);
    foodItem.protein.splice(index, 1);
    foodItem.sugars.splice(index, 1);

    await foodItem.save();
    res.status(200).json({
      message: `Food item '${foodName}' and related data deleted successfully.`,
      data: foodItem,
    });
  } catch (error) {
    console.error("Error deleting food item:", error);
    res.status(500).json({ error: "Failed to delete food item." });
  }
});


router.put("/add-update-food", async (req, res) => {
  try {
    console.log("Request payload:", req.body);

    const { day, mealType, name, calories, fats, protein, sugars } = req.body;

    if (!day || !mealType || !name) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    // Look for existing food entry
    const existingFood = await FoodItem.findOne({
      day,
      mealType,
      name: name.toLowerCase(),
    });

    if (existingFood) {
      console.log("Updating existing food entry.");
      existingFood.calories = calories;
      existingFood.fats = fats;
      existingFood.protein = protein;
      existingFood.sugars = sugars;
      await existingFood.save();
      return res
        .status(200)
        .json({ message: "Food updated successfully", data: existingFood });
    }

    // Create a new food entry if it doesn't exist
    const newFoodEntry = new FoodItem({
      day,
      mealType,
      name,
      calories,
      fats,
      protein,
      sugars,
    });

    console.log("Saving new food entry.");
    const savedFood = await newFoodEntry.save();
    return res
      .status(201)
      .json({ message: "Food created successfully", data: savedFood });
  } catch (error) {
    console.error("Error in add/update endpoint:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});


module.exports = router;
