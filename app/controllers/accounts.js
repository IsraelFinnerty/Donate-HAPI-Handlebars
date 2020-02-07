'use strict';

const User = require('../models/user');
const Boom = require('@hapi/boom');

const Accounts = {
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'Welcome to Donations' });
        }
    },

    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for Donations' });
        }
    },

    signup: {
        auth: false,
        handler: async function (request, h) {
            const payload = request.payload;
            const previousUser = await User.findByEmail(payload.email);
            try {
                if (!previousUser) {
                    const newUser = new User({
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        email: payload.email,
                        password: payload.password
                    });
                    const user = await newUser.save();
                    request.cookieAuth.set({id: user.id});
                    return h.redirect('/home');
                } else {
                    const message = 'Email address is already in use!';
                    throw Boom.badData(message);
                }
            }
        catch (err) {
                return h.view('signup', { errors: [{ message: err.message }] });
            }
        }
    },


    showSettings: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id).lean();
                return h.view('settings', {title: 'Settings', user: user});
            }
        catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
        }
    }
    },

    settings: {
        handler: async function(request, h) {
            try {
                const userEdit = request.payload;
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                user.firstName = userEdit.firstName;
                user.lastName = userEdit.lastName;
                user.email = userEdit.email;
                user.password = userEdit.password;
                await user.save();
                return h.redirect('/settings');
            }
            catch (err) {
                return h.view('settings', { errors: [{ message: err.message }] });
            }
        }
    },


    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login to Donations' });
        }
    },

    login: {
        auth: false,
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let user = await User.findByEmail(email);
                if (!user) {
                    const message = 'Email address is not registered';
                    throw Boom.unauthorized(message);
                }
                user.comparePassword(password);
                request.cookieAuth.set({ id: user.id });
                return h.redirect('/home');
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },



    logout: {
        handler: function(request, h) {
            request.cookieAuth.clear();
            return h.redirect('/');
        }
    }
};

module.exports = Accounts;