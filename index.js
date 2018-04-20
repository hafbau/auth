'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Auth Class
 */
var uuid = require('cuid');
var request = require('request-promise-native');

var Auth = function () {
    function Auth(_ref) {
        var _ref$appId = _ref.appId,
            appId = _ref$appId === undefined ? uuid() : _ref$appId,
            _ref$apiUrl = _ref.apiUrl,
            apiUrl = _ref$apiUrl === undefined ? 'http://localhost:3000' : _ref$apiUrl;

        _classCallCheck(this, Auth);

        this.appId = appId;
        this.apiUrl = apiUrl;
    }

    _createClass(Auth, [{
        key: 'init',
        value: function init(_ref2) {
            var _ref2$appId = _ref2.appId,
                appId = _ref2$appId === undefined ? this.appId : _ref2$appId,
                _ref2$apiUrl = _ref2.apiUrl,
                apiUrl = _ref2$apiUrl === undefined ? this.apiUrl : _ref2$apiUrl;

            // backfills constructor
            this.appId = appId;
            this.apiUrl = apiUrl;
        }
    }, {
        key: 'registerWithEmailAndPassword',
        value: function registerWithEmailAndPassword(userDetail) {
            var _this = this;

            return request({
                method: 'POST',
                uri: this.apiUrl + '/users',
                body: JSON.parse(JSON.stringify(userDetail)),
                json: true
            }).then(function (response) {
                _this.token = response.token;
                _this.currentUser = response.user;
                return response.user;
            }).catch(function (err) {
                throw err;
            });
        }
    }, {
        key: 'loginWithEmailAndPassword',
        value: function loginWithEmailAndPassword(_ref3) {
            var _this2 = this;

            var email = _ref3.email,
                password = _ref3.password;

            return request({
                method: 'POST',
                uri: this.apiUrl + '/login',
                body: { 'email': email, 'password': password },
                json: true
            }).then(function (response) {
                _this2.token = response.token;
                _this2.currentUser = response.user;
                return response.user;
            }).catch(function (err) {
                throw err;
            });
        }
    }, {
        key: 'logout',
        value: function logout() {
            var _this3 = this;

            var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.token;

            return request({
                method: 'POST',
                uri: this.apiUrl + '/logout',
                headers: { 'x-access-token': token },
                body: { 'token': token },
                json: true
            }).then(function (response) {
                if (response.loggedIn == false || response.success) {
                    _this3.currentUser = null;
                    _this3.token = undefined;
                }
                return response;
            }).catch(function (err) {
                throw err;
            });
        }
    }, {
        key: 'isLoggedIn',
        value: function isLoggedIn() {
            if (!this.token) return Promise.resolve(false);
            return this.refreshUser();
        }
    }, {
        key: 'refreshUser',
        value: function refreshUser() {
            var _this4 = this;

            var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.token;

            return request({
                method: 'GET',
                uri: this.apiUrl + '/',
                headers: { 'x-access-token': token },
                json: true
            }).then(function (response) {
                if (response.loggedIn === false) {
                    _this4.currentUser = null;
                    _this4.token = undefined; // invalidates the now useless token
                } else {
                    _this4.currentUser = response.user;
                }
                return _this4.currentUser;
            }).catch(function (err) {
                throw err;
            });
        }
    }, {
        key: 'update',
        value: function update(userDetail) {
            var _this5 = this;

            var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.token;

            return Promise.resolve().then(function (_) {
                if (userDetail._id && _this5.currentUser && userDetail._id !== _this5.currentUser._id) throw new Error('You cannot update another user');

                return request({
                    method: 'PUT',
                    uri: _this5.apiUrl + '/users/' + userDetail._id,
                    headers: {
                        'x-access-token': token
                    },
                    body: JSON.parse(JSON.stringify(userDetail)),
                    json: true
                });
            }).then(function (response) {
                _this5.currentUser = response.user;
                return response.user;
            }).catch(function (err) {
                throw err;
            });
        }
    }]);

    return Auth;
}();

// exports a singleton instance


module.exports = new Auth({});
