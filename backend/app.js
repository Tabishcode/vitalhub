const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

let User = require('./models/user');
let Password = require('./models/password');
let Food = require('./models/food');
const articleRouter = require('./routes/articles.js');
const userRouter = require('./routes/user.js');

const MONGO_URL = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// app.get('/users', async (req, res) => {
//     let users = await User.find({}).select('username email hash salt');;
//     res.json(users);
// });

const ExerciseLog = require('./models/exerciseLog.js');

// Example object creation
const newExerciseLog = new ExerciseLog({
    userId: ('6712b613abfb4ad85f770072'), // Replace with actual user ID
    date: new Date('2024-12-05'),
    cardiovascular: [
        {
            exerciseId: ('671abfb0c4372fc417564f94'), // Replace with actual exercise ID
            duration: 30, // Duration in minutes
        },
        {
            exerciseId: ('671abfb0c4372fc417564f95'), // Replace with actual exercise ID
            duration: 20,
        },
    ],
    strength: [
        {
            exerciseId: ('671abfb0c4372fc417564f9f'), // Replace with actual exercise ID
            sets: 3,
            reps: 12,
        },
        {
            exerciseId: ('671abfb0c4372fc417564fa1'), // Replace with actual exercise ID
            sets: 4,
            reps: 10,
        },
    ],
    note: 'Focus on form for squats and increase cardio intensity next time.',
});

// Save the object to the database
// newExerciseLog
    // .save()
    // .then((savedLog) => {
    //     console.log('Exercise log saved successfully:', savedLog);
    // })
    // .catch((error) => {
    //     console.error('Error saving exercise log:', error);
    // });

app.use('/api/articles', articleRouter);

app.use('/api/user', userRouter);

app.get("/app", (req, res) => {
    res.redirect("http://localhost:5173");
});

app.get('*', (req, res) => {
    res.send("404 Page Not Found");
});

app.get("/", (req, res) => {
  console.log("A Request Received at the port!");
  res.send("The Route is Working!");
});

app.listen(8080, () => {
  console.log("Server is running at port 8080");
});
