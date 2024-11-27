const Movie = require("../models/Movie");
const User = require("../models/User");
const {errorHandler} = require("../auth");
const mongoose = require("mongoose");

// Add new movie
module.exports.addMovie = async (req, res) => {
    try {
        const userId = req.user.id;

        const existingMovie = await Movie.findOne({ title: req.body.title, userId });

        if (existingMovie) {
            return res.status(409).send({ message: 'Movie already exists.' });
        }

        const newMovie = new Movie({
            userId: userId,
            title: req.body.title,
            director: req.body.director,
            year: req.body.year,
            description: req.body.description,
            genre: req.body.genre,
            comments: req.body.comments,
        });

        const savedMovie = await newMovie.save();

        res.status(201).send({
            movie: savedMovie,
        });
    } catch (err) {
        res.status(500).send({ message: 'Error adding movie.', error: err.message });
    }
};

// Retrieve all movies
module.exports.getAllMovies = (req, res) => {
    const userId = req.user.id;

    Movie.find({ userId })
        .then(movies => {
            if (movies.length > 0) {
                res.status(200).send({ movies });
            } else {
                res.status(404).send({ message: 'No movies found.' });
            }
        })
        .catch(err => errorHandler(err, req, res));
};

// Retrieve a movie by ID
module.exports.getMovieById = (req, res) => {
    const movieId = req.params.movieId;
    if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).send({ message: 'Invalid movie ID.' });
    }
    Movie.findById(movieId)
        .populate('userId', 'email')
        .populate('comments.userId', 'email')
        .then(movie => {
            if (!movie) {
                return res.status(404).send({ message: 'Movie not found.' });
            }

            res.status(200).send({
                message: 'Movie retrieved successfully.',
                movie
            });
        })
        .catch(err => errorHandler(err, req, res));
};

// Update a movie by ID
module.exports.updateMovie = (req, res) => {
    const userId = req.user.id;
    const movieId = req.params.movieId;
        
    const updatedMovie = {
        userId: userId,
        title: req.body.title,
        director: req.body.director,
        year: req.body.year,
        description: req.body.description,
        genre: req.body.genre,
        comments: req.body.comments
    };

    Movie.findByIdAndUpdate(movieId, updatedMovie, { new: true })
        .then(movie => {
            if (movie) {
                res.status(200).send({ message: 'Movie updated successfully', updatedMovie});
            } else {
                res.status(404).send({ message: 'Movie not found.' });
            }
        })
        .catch(err => errorHandler(err, req, res));
};

// Delete a movie by ID
module.exports.deleteMovie = (req, res) => {
    const userId = req.user.id;

    Movie.findByIdAndDelete(req.params.movieId)
        .then(movie => {
            if (movie) {
                res.status(200).send({ message: 'Movie deleted successfully.' });
            } else {
                res.status(404).send({ message: 'Movie not found.' });
            }
        })
        .catch(err => errorHandler(err, req, res));
};

// Add new comment
// module.exports.addMovieComment = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const movieId = req.params.movieId;

//         const existingComment = await Comment.findOne({ comment: req.body.comment, userId , movieId});

//         if (existingComment) {
//             return res.status(409).send({ message: 'Comment already exists.' });
//         }

//         const newComment = new Comment({
//             userId: userId,
//             movieId: movieId,
//             comment: req.body.comment
//         });

//         const savedComment = await newComment.save();

//         res.status(201).send({
//             message: 'Comment added successfully.',
//             comment: savedComment,
//         });
//     } catch (err) {
//         res.status(500).send({ message: 'Error adding comment.', error: err.message });
//     }
// };
module.exports.addMovieComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const movieId = req.params.movieId;

        // Find the movie to add a comment
        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).send({ message: 'Movie not found.' });
        }

        // Check for duplicate comments by the same user on the same movie
        const existingComment = movie.comments.find(
            (comment) => comment.userId.toString() === userId && comment.comments === req.body.comments
        );

        if (existingComment) {
            return res.status(409).send({ message: 'Comment already exists.' });
        }

        // Create a new comment
        const newComment = {
            userId,
            movieId,
            comments: req.body.comments,
        };

        // Add the comment to the movie's comments array
        movie.comments.push(newComment);

        // Save the updated movie
        const updatedMovie = await movie.save();

        res.status(201).send({
            message: 'Comment added successfully.',
            movie: updatedMovie,
        });
    } catch (err) {
        res.status(500).send({
            message: 'Error adding comment.',
            error: err.message,
        });
    }
};



// Retrieve all comments
// module.exports.getMovieComments = (req, res) => {
//     const userId = req.user.id;

//     Movie.find({ userId })
//         .then(movies => {
//             if (movies.length > 0) {
//                 res.status(200).send({ movies });
//             } else {
//                 res.status(404).send({ message: 'No comments found.' });
//             }
//         })
//         .catch(err => errorHandler(err, req, res));
// };

module.exports.getMovieComments = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const movie = await Movie.findById(movieId).populate({
            path: 'comments.userId',
            select: '_id email',
        });

        if (!movie) {
            return res.status(404).send({ message: 'Movie not found.' });
        }

        res.status(200).send({
            comments: movie.comments,
        });
    } catch (err) {
        res.status(500).send({
            message: 'Error retrieving comments.',
            error: err.message,
        });
    }
};
