var admin = require('firebase-admin');
var serviceAccount = require("../firebase/firebase-admin.json");
var express = require('express');
var router = express.Router();


const FirebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://registration-dc367.firebaseio.com"
})
//Crea un  usuario
router.post('/create', async (req, res, next) => {

    const { user, admin } = req.body;
    FirebaseAdmin.auth().createUser(user)
    .then(function(userRecord) {
        res.json(userRecord);
        console.log("Successfully created new user:", userRecord);
        FirebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {
          admin: admin
        });
    })
    .catch(function(error) {
        console.log(error.message);
        res.status(500).send({ error: error.message });
    });
});

//Borra un usuario 
router.delete('/delete/:email', async (req, res, next) => {

  const email = req.params.email;
  console.log(req.params);
  FirebaseAdmin.auth().getUserByEmail(email)
    .then(function(user){
      console.log(user);
      FirebaseAdmin.auth().deleteUser(user.uid)
        .then(function(){
          res.status(200);
        });
    })  
});

//Actualiza permiso ADM
router.put('/updateAdm/:email', async (req, res, next) => {

  const email = req.params.email;
  const { admin } = req.body;

  FirebaseAdmin.auth().getUserByEmail(email)
    .then(function(user){
      console.log(user);
      res.json(user);
      FirebaseAdmin.auth().setCustomUserClaims(user.uid, {
        admin: admin
      });
    })  
});


module.exports = router;