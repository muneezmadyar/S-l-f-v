import express from "express";
import { familyModel } from "../models/family.model.js";
import verifyToken from "../middleware/verifyToken.js"
const router = express.Router();


// CREATE
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { name, relation } = req.body;
    console.log(name);
    console.log(relation);
    
    console.log(req.body)
    const user = await familyModel.create({
      userId: req.userId,
      name,
      relation,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ (all family members of logged-in user)
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await familyModel.find({ userId: req.userId });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedUser = await familyModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedUser = await familyModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
