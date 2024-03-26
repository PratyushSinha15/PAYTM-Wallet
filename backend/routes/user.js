const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});
//signup route

router.post("/signup", async (req, res) => {
  const { success } = signupSchema.safeParse(req.body); //safeParse is used to validate the data that is being sent to the server
  if (!success) {
    res.status(411).json({
      message: "Email Already Taken or Invalid Data",
    });
  }

  //checking if the user already exists
  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(401).json({
      message: "User Already Exists",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // if user does not exist then create a new user
  const user = await User.create({
    username: req.body.username,
    password: hashedPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id; //getting the id of the user

  //inserting dummy balance in users account
  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  //creating a jwt token
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  //sending the response back to the user
  res.status(201).json({
    message: "User Created",
    token: token,
  });
});

const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

//user route
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Fetch the user details from the database using the user ID stored in req.userId
    const user = await User.findById(req.userId);

    if (user) {
      // Send the user details in the response
      res.json({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      });
    } else {
      // If user is not found, send a 404 response
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // If an error occurs, send a 500 response
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//Signin route
router.post("/signin", async (req, res) => {
  //validating the data that is being sent to the server using safeParse method
  //safeParse method is used to validate the data that is being sent to the server
  //if the data is invalid then it will send a response back to the user
  const { success } = signinSchema.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Email already taken or Invalid Data",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
  });
  if (user) {
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if(isPasswordValid) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        res.json({
            message: "User Logged In",
            token: token
        });
    } else {
        res.status(401).json({
            message: "Invalid Credentials"
        });
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
  } else {
    res.status(401).json({
      message: "Invalid Credentials",
    });
  }
});

//updating user details
const updateSchema = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

//route to update user details
// Route to update user details
//here we are using try catch block to catch the error if there is any error in the code
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { success } = updateSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: "Invalid request body" });
    } else {
      const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, {
        new: true,
      });
      if (updatedUser) {
        res.json({ message: "Updated successfully", user: updatedUser });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get detail of current user
//this route is used to get the details of the current user

// if the request URL is http://example.com/bulk?filter=John, req.query.filter will be "John".
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    //using regex to search for the user
    //regex is used to search for the user in the database using the filter that is being sent to the server by the user
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastname: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
