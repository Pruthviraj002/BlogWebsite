const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Public route: Admin Login (no auth required)
router.post("/login", adminController.adminLogin);

// All routes below are protected
router.use(verifyToken, isAdmin);

router.get("/analytics", adminController.getAnalytics);
router.get("/stats", adminController.getAnalytics);
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id/block", adminController.toggleBlockUser);
router.patch("/users/block/:id", adminController.toggleBlockUser);
router.delete("/users/:id", adminController.deleteUser);
router.get("/comments", adminController.getAllComments);
router.delete("/comments/:id", adminController.deleteComment);

router.get("/blogs", adminController.getAllBlogs);
router.get("/blogs/:id", adminController.getBlogById);
router.delete("/blogs/:id", adminController.deleteBlog);

router.get("/categories", adminController.getAllCategories);
router.post("/categories", adminController.createCategory);
router.delete("/categories/:id", adminController.deleteCategory);

router.get("/messages", adminController.getAllMessages);
router.delete("/messages/:id", adminController.deleteMessage);

router.get("/settings", adminController.getSettings);
router.patch("/settings", adminController.updateSettings);

module.exports = router;
