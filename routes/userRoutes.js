const express = require("express");
const userController = require("./../controllers/userController")
const authController = require("./../controllers/authController")

let router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout)

// Protect all routes after this middleware
// router.use(authController.protect)

router.delete('/deleteMe', userController.deleteMe);

// Restrict all the routes after this to admin
// router.use(authController.restrictTo('admin'));

router
  .route("/")
  .post(userController.createUser)
  .get(userController.getAllUsers)

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
