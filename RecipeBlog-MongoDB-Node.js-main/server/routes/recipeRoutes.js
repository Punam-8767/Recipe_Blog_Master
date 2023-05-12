const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App Routes 
*/
router.get('/home', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.get('/login', recipeController.loginpage);
router.get('/', recipeController.registerpage)
router.get('/logout', recipeController.loginpage)

module.exports = router;