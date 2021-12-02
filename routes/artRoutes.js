const express = require('express');
const artController = require('./../controllers/artController');

// TOURS ROUTES
let router = express.Router();

router
  .route('/')
  .get(artController.getAllArts)
  .post(artController.createArt);

router
  .route('/:id')
  .get(artController.getArt)
  .patch(artController.updateArt)
  .delete(artController.deleteArt)


module.exports = router
