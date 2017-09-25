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
            return response;
        })
        .catch(err => {
            throw err
        })
     }

    loginWithEmailAndPassword({ email, password }) {
        return request({
            method: 'POST',
            uri: `${this.apiUrl}/login`,
            body: { email, password },
            json: true
        })
        .then(response => {
            this.token = response.token;
            return response;
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
            return response;
        })
        .catch(err => {
            throw err
        })
    }
 }

 module.exports = new Auth({});