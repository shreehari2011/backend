const express = require("express");
const router = express.Router();
const { getPosts, createPost, votePost } = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getPosts);
router.post("/", protect, createPost);
router.put("/:id/vote", protect, votePost);

module.exports = router;