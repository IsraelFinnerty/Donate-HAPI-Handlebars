'use strict';

const Venue = require('../models/venues');
const User = require('../models/user');
const Boom = require('@hapi/boom');

const Venues = {
    addVenueForm: {
        handler: async function(request, h) {
            const venues = await Venue.find().lean();
            return h.view('home', {
                title: 'Add a venue',
                venues: venues
            });
        }
    },

    category: {
        handler: async function(request, h) {
            const venues = await Venue.find().lean();
            return h.view('category', {
                title: 'Add a category',
                venues: venues
            });
        }
    },

    addCategory: {
        handler: async function(request, h) {
            try {
                const venues = await Venue.find().lean();
                const payload = request.payload;
                const newCategory = new Venue({
                    category: payload.category
                })
                await newCategory.save();
                return h.redirect('/category', {
                    title: 'Add a category',
                    venues: venues
                });
            }
            catch (err) {
                    return h.view('category', { errors: [{ message: err.message }] });
                }
        }
    },

    report: {
        handler: async function(request, h) {
            const venues = await Venue.find().lean();
                 return h.view('report', {
                title: 'Venues',
                venues: venues
                });
        }
    },

    addVenue: {
        handler: async function(request, h) {
            const payload = request.payload;
            try {
                const newVenue = new Venue({
                    category: payload.category,
                    pois: [{
                        name: payload.name,
                        location: payload.location,
                        geo: {
                            lat: payload.lat,
                            long: payload.long
                        },
                        website: payload.website,
                        imageMain: payload.imageMain,
                        image1: payload.image1,
                        image2: payload.image2,
                        image3: payload.image3,
                        description: payload.description
                    }]
                });
                const venue = await Venue.addVenue(newVenue);
                console.log(venue);
                venue.pois.push(newVenue.pois[0]);
                venue.save();
                return h.redirect('/venues');
            }
            catch (err) {
                return h.view('home', { errors: [{ message: err.message }] });
            }
        }
    },


    showVenue: {
        handler: async function(request, h) {
            const id = request.params.id;
            try {
               const venue = await Venue.findByUID(id).lean();
                return h.view('venue',
                {
                    title: 'Venues',
                    venue: venue
                }
                );
            }
            catch (err) {
                return h.view('venue', { errors: [{ message: err.message }] });
            }
        }

    },

    deleteVenue: {
        handler: async function(request, h) {
            const id = request.params.id;
            try {
                await Venue.deleteVenue(id);
                return  h.redirect('/venues');
            }
            catch (err) {
                return h.redirect('/venues', { errors: [{ message: err.message }] });
            }
        }

    },

    updateVenue: {
        handler: async function(request, h) {
            const id = request.params.id;
            try {
                const venue = await Venue.findByUID(id).lean();
                return h.view('update',
                    {
                        title: 'Venues',
                        venue: venue
                    }
                );
            }
            catch (err) {
                return h.view('update', { errors: [{ message: err.message }] });
            }
        }

    },

    applyUpdates: {
        handler: async function(request, h) {
            const id = request.params.id;
            try {
                const venue = await Venue.findOneByUID(id);
                //console.log(venue.pois[0]);
                const userEdit = request.payload;
               /* venue.update({"venue.pois[0]._id" : id}, {$set: {
                        "venue.pois[0].name" : userEdit.name,
                        "venue.pois[0].category": "userEdit.category",
                        "pois[0].location": "userEdit.location",
                        "pois[0].description": "userEdit.description",
                        "pois[0].website": "userEdit.website",
                        "pois[0].geo.lat": "userEdit.lat",
                        "pois[0].geo.long": "userEdit.long"
                    }
            });
                console.log(venue.pois[0].name);*/
                Venue.updateVenue(venue, userEdit);
                return h.redirect('/venue/update/' + venue.pois[0]._id);
            }
            catch (err) {
                return h.view('update', { errors: [{ message: err.message }] });
            }
        }

    },


};

module.exports = Venues;