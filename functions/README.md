setAdminClaim Cloud Function

Purpose
- Provide a secure, auditable way to set or remove the `admin` custom claim on Firebase users without distributing service account keys to operators.

Security model
- Callable only by authenticated users.
- Caller must already have the `admin` custom claim OR be present in the `project_owners/{callerUid}` Firestore collection.
- Initial admin(s) must be created via a trusted environment (service account) or using `scripts/setAdminClaim.js`.

Deploy
1) From repo root (ensure `firebase-tools` is installed and you are logged in to the correct project):

```bash
cd functions
npm install
cd ..
firebase deploy --only functions:setAdminClaim
```

Usage (client)
```js
// Client must be signed in and have permission to call the function
const setAdminClaim = firebase.functions().httpsCallable('setAdminClaim');
setAdminClaim({ uid: 'TARGET_UID', makeAdmin: true })
  .then(res => console.log('Result:', res.data))
  .catch(err => console.error(err));
```

Notes
- After setting a custom claim, the affected user must refresh their ID token (e.g. sign out/in or call `getIdTokenResult(true)`) to see the updated claims.
- Do NOT expose this function to unauthenticated clients. The function enforces checks but protect it via IAM and call restrictions where possible.
