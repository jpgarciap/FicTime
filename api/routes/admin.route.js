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
router.delete('/delete/:email/:id', async (req, res, next) => {

  const email = req.params.email;
  const userId = req.params.id;
  FirebaseAdmin.auth().getUserByEmail(email)
    .then(function(user){
      console.log(user);
      FirebaseAdmin.auth().deleteUser(user.uid)
        .then(function(){
          res.status(200);
        });
    })  
  
    deleteHistoricals(FirebaseAdmin.firestore(), userId, 'historicals', 100);
});


function deleteHistoricals(db, userId, collectionPath, batchSize) {
  let collectionRef = db.collection(collectionPath);
  let query = collectionRef.where('user', '==', userId).limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size == 0) {
        return 0;
      }

      // Delete documents in a batch
      let batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    }).then((numDeleted) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}


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