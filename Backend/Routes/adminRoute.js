const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// All admin routes are protected
router.use(verifyToken, isAdmin);

router.get("/analytics", adminController.getAnalytics);
router.get("/users", adminController.getAllUsers);
router.put("/users/:id/block", adminController.toggleBlockUser);
router.delete("/users/:id", adminController.deleteUser);
router.get("/comments", adminController.getAllComments);
router.delete("/comments/:id", adminController.deleteComment);

router.get("/categories", adminController.getAllCategories);
router.post("/categories", adminController.createCategory);
router.delete("/categories/:id", adminController.deleteCategory);

router.get("/messages", adminController.getAllMessages);
router.delete("/messages/:id", adminController.deleteMessage);

module.exports = router;
