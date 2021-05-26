import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import * as serviceAccount from './serviceAccountKey.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});
export default admin