const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const webpush = require('web-push');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
let serviceAccount = require('./pwagram-key.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://pwagram-bff28.firebaseio.com/'
});

exports.helloWorld = functions.https.onRequest((request, response) => {
 cors(request, response, () => {
     admin.database().ref('posts').push({
         id: request.body.id,
         title: request.body.title,
         location: request.body.location,
         image: request.body.image
     })
        .then( () => {
            webpush.setVapidDetails('mailto:doNotReplay@com',
             'BJ6ACh89esk36eZDm4E7cZThiimE77E4DrdnYjgCRrGUmEcDv3-NeqJhc3E9tAEB6OtXFN8H4KVncVmjIEQeV58',
             'Qc_icsg_3XuHJwvrVzlhc18cgIO0emGMVXM115TjEug');
             return admin.database.ref('subscriptions').once('value');
        })
        .then ( (subs) => {
            subs.forEach( (sub) => {
                let pushConf = {
                    endpoint: sub.val().endpoint,
                    keys: {
                        auth: sub.val().keys.auth,
                        p256dh: sub.val().keys.p256dh
                    }
                };
                webpush.sendNotification(pushConf, JSON.stringify({
                    title: 'New post',
                    content: 'New Post added!',
                    openUrl: '/help'     
                }))
                    .catch((err) => {
                        console.log(err);
                    })
            });
            response.status(200).json();
        })
        .catch( (err) => {
            response.status(500).json({error: err});
        });
 });
});
