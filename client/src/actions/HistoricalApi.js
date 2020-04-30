import { app } from '../components/Firebase/firebase'

export function historical(email, state) {
    var historicals = app.firestore().collection('historicals');

    app.firestore()
    .collection('users').where('email','==', email)
    .get()
    .then(function(userDocs){
        var result = []
        userDocs.forEach(function(userDoc){
            historicals.where('user', '==', userDoc.id)
            .get()
            .then(function(historicalDocs){
                historicalDocs.forEach(function(historicalDoc){
                    var data = historicalDoc.data();
                    result.push(createData(data.date, data.start, data.end))
                })
            })            
        })

        console.log(result);

        state({
            rows: result
        });
    });
}

function createData(date, start, end) {
    return { date, start, end};
}