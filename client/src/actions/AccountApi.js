import { app } from '../components/Firebase/firebase'

export function requestAccount(data) {
    app.firestore().collection('accounts').add(data);
}
