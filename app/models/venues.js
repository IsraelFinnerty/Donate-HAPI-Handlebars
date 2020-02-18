'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');

const venueSchema = new Schema({
    category: String,
    name: String,
    location: String,
    geo: {
        lat: Number,
        long: Number
    },
    website: String,
    description: String
});



module.exports = Mongoose.model('Venues', venueSchema);