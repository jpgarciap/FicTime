import app from '../components/Firebase/firebase'
import 'firebase/database';

export function createAccount(data) {
    app.firestore().collection('accounts').add(data);
}