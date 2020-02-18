'use strict';

const Venue = require('../models/venues');
const User = require('../models/user');
const Boom = require('@hapi/boom');

const Venues = {
    home: {
        handler: function(request, h) {
            return h.view('home', { title: 'Make a Donation' });
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
                    name: payload.name,
                    location: payload.location,
                    geo: {
                        lat: payload.lat,
                        long: payload.long
                    },
                    website: payload.website,
                    description: payload.description
                });
                await newVenue.save();
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
                const venue = await Venue.findById(id).lean();
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
                await Venue.findByIdAndDelete(id);
                return  h.redirect('/venues');
            }
            catch (err) {
                return h.view('venue', { errors: [{ message: err.message }] });
            }
        }

    },

    updateVenue: {
        handler: async function(request, h) {
            const id = request.params.id;
            try {
                const venue = await Venue.findById(id).lean();
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
                 const venue = await Venue.findById(id);
                 const userEdit = request.payload;
                 venue.name = userEdit.name;
                 venue.category = userEdit.category;
                 venue.location = userEdit.location;
                 venue.desctiption = userEdit.description;
                 venue.website = userEdit.website;
                 venue.geo.lat = userEdit.lat;
                 venue.geo.long = userEdit.long;
                 await venue.save();
                 return h.redirect('/venue/update/' + venue._id);
            }
            catch (err) {
                return h.view('update', { errors: [{ message: err.message }] });
            }
        }

    },


};

module.exports = Venues;