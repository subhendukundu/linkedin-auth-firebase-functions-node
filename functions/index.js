'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {linkedInLogin, linkedInToken } = require('../helpers');

const serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
});

exports.linkedInLogin = functions.https.onRequest(linkedInLogin);
exports.linkedInToken = functions.https.onRequest(linkedInToken);
