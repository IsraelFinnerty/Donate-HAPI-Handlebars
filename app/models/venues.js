'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');

const venueSchema = new Schema({
    category: String,
    pois: [{
        name: String,
        location: String,
        geo: {
            lat: Number,
            long: Number
        },
        website: String,
        imageMain: String,
        image1: String,
        image2: String,
        image3: String,
        description: String
    }]
});

venueSchema.statics.findByUID = function(id) {
    var id2 = Mongoose.Types.ObjectId(id);
    return this.find({ "pois._id" : id2},{_id:0, "pois.$": 1});


};

venueSchema.statics.findOneByUID = function(id) {
    var id2 = Mongoose.Types.ObjectId(id);
    return this.findOne({ "pois._id" : id2}, {_id:1, "pois.$": 1});



};

venueSchema.statics.addVenue = function(newVenue) {
    return this.findOne({category : newVenue.category});

};

venueSchema.statics.deleteVenue = function(id) {
    var id2 = Mongoose.Types.ObjectId(id);
    return this.findOneAndUpdate({"pois._id": id2}, {$pull: {pois: {_id: id2}}}, {multi: true});
};

venueSchema.statics.updateVenue = function(venue, userEdit) {
    var id2 = Mongoose.Types.ObjectId(venue.pois[0]._id);
    console.log(venue.pois[0]._id);
    const list = this.find({pois: {$elemMatch: {name: 'Pipers Corner'}}});
    console.log(list);
    return  list.findOneAndUpdate({"pois: {$elemMatch: {name}}" : "userEdit.name"}, {$set: {
            "pois.0.name" : "userEdit.name",
            "pois.0.category": "userEdit.category",
            "pois[0].location": "userEdit.location",
            "pois[0].description": "userEdit.description",
            "pois[0].website": "userEdit.website",
            "pois[0].geo.lat": "userEdit.lat",
            "pois[0].geo.long": "userEdit.long"
        }
    });

    };

module.exports = Mongoose.model('Venues', venueSchema);