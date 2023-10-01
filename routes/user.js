const express = require("express");
const router = express.Router();

// Need handlers for login and signup

const {login, signup} = require("../controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middlewares/auth")
router.post("/login",login);
router.post("/signup",signup);

// Testing route for single middleware
router.get("/test", auth, (req,res) => {
     res.json({
          success:true,
          message:"Welcome to protected route for testing purpose"
     })
})


// Protected route
router.get("/student", auth, isStudent, (req,res) => {
     res.json({
          success:true,
          message:"Welcome to protected route for student"
     });
});

router.get("/admin", auth, isAdmin, (req,res) => {
     res.json({
          success:true,
          message:"Welcome to protected route for admin"
     })
})

module.exports = router;
