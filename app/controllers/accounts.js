'use strict';

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
        handler: function(request, h) {
            const user = request.payload;
            this.users[user.email] = user;
            request.cookieAuth.set({ id: user.email });
            return h.redirect('/home');
        }
    },


    settings: {
        handler: function(request, h) {
            const user = request.payload;
            this.users[user.email] = user;
            console.log(user);
            request.cookieAuth.set({ id: user.email });
            return h.redirect('/home');
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
        handler: function(request, h) {
            const user = request.payload;
            if (user.email in this.users && user.password === this.users[user.email].password) {
                request.cookieAuth.set({ id: user.email });
                return h.redirect('/home');
            }
            return h.redirect('/');
        }
    },

    showSettings: {
        handler: function(request, h) {
            return h.view('settings', { title: 'Settings', user:this.users[request.auth.credentials.id]});
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