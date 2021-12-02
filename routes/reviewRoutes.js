const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

let router = express.Router();

router.use(authController.protect)

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview)


router
  .route("/:id")
  .get(reviewController.getReview)

module.exports  = router
