import admin from "firebase-admin"
import * as serviceAccount from "todoYourself"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin