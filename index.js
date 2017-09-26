/**
 * Auth Class
 */
const uuid = require('cuid');
const request = require('request-promise-native');

 class Auth {
     constructor({ appId = uuid(), apiUrl = 'http://localhost:3000' }) {
        this.appId = appId;
        this.apiUrl = apiUrl;
     }

     init({ appId = this.appId, apiUrl = this.apiUrl }) {
         // backfills constructor
         this.appId = appId;
         this.apiUrl = apiUrl;
     }

    registerWithEmailAndPassword({ email, password }) {
        return request({
            method: 'POST',
            uri: `${this.apiUrl}/register`,
            body: { 'email': email, 'password': password },
            json: true
        })
        .then(response => {
            this.token = response.token;
            this.currentUser = response.user;
            return response.user;
        })
        .catch(err => {
            throw err
        })
    }

    loginWithEmailAndPassword({ email, password }) {
        return request({
            method: 'POST',
            uri: `${this.apiUrl}/login`,
            body: { 'email': email, 'password': password },
            json: true
        })
        .then(response => {
            this.token = response.token;
            this.currentUser = response.user;
            return response.user;
        })
        .catch(err => {
            throw err
        })
    }

    logout() {
        return request({
            method: 'POST',
            uri: `${this.apiUrl}/logout`,
            body: { token: this.token },
            json: true
        })
        .then(response => {
            if (response.loggedIn == false || response.success) {
                this.currentUser = null;
                this.token = undefined;
            }
            return response;
        })
        .catch(err => {
            throw err
        });
    }
    
    isLoggedIn() {
        if (!this.token) return Promise.resolve(false);
        return this.refreshUser();
    }
    
    refreshUser() {
        return request({
            method: 'GET',
            uri: `${this.apiUrl}/`,
            headers: { 'x-access-token': this.token },
            json: true
        })
        .then(response => {
            if (response.loggedIn === false) {
                this.currentUser = null;
                this.token = undefined; // invalidates the now useless token
            } else {
                this.currentUser = response.user;
            }
            return this.currentUser;
        })
        .catch(err => {
            throw err
        });
        
    }
 }

 // exports a singleton instance
 module.exports = new Auth({});