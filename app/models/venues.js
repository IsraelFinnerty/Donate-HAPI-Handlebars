'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');

const venueSchema = new Schema({
    _id: String,
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

venueSchema.statics.findByUID = function(id) {
    var id2 = Mongoose.Types.ObjectId(id);
    return this.find({ "pois._id" : id2},{_id:0, "pois.$": 1});

}

module.exports = Mongoose.model('Venues', venueSchema);