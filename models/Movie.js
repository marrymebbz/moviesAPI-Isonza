const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required.']
    },
    title: {
        type: String,
        required: [true, 'Movie title is required.']
    },
    director: {
        type: String,
        required: [true, 'Movie director name is required.']
    },
    year: {
        type: Number,
        required: [true, 'Movie year is required.'],
        min: [1888, 'Year must be after the first known movie release.']
    },
    description: {
        type: String,
        required: [true, 'Movie description is required.'],
        maxlength: [500, 'Description cannot exceed 500 characters.']
    },
    genre: {
        type: String,
        required: [true, 'Movie genre is required.']
    },
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: [true, 'User ID is required for a comment.']
            },
            movieId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Movie',
                required: [true, 'Movie ID is required for a comment.']
            },
            comments: {
                type: String,
                required: [true, 'Comment text is required.'],
            }
        }
    ]
});

module.exports = mongoose.model('Movie', movieSchema);
