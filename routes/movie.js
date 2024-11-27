const express = require('express');
const movieController = require('../controllers/movie');
const auth = require("../auth");
const { verify, isLoggedIn, verifyAdmin } = auth;

const router = express.Router();

// Add new movie
router.post('/addMovie', verify, isLoggedIn, verifyAdmin, movieController.addMovie);

// Retrieve all movies
router.get('/getMovies', verify, isLoggedIn, movieController.getAllMovies);

// Retrieve a movie by ID
router.get('/getMovie/:movieId', verify, isLoggedIn, movieController.getMovieById);

// Update a movie by ID
router.patch('/updateMovie/:movieId', verify, isLoggedIn, verifyAdmin, movieController.updateMovie);

// Delete a movie by ID
router.delete('/deleteMovie/:movieId', verify, isLoggedIn, verifyAdmin, movieController.deleteMovie);

// Add new comment
router.patch('/addComment/:movieId', verify, isLoggedIn, movieController.addMovieComment);

// Retrieve all comments
router.get('/getComments/:movieId', verify, isLoggedIn, movieController.getMovieComments);

module.exports = router;
