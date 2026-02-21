Admin claims: production setup and verification

1) Create a service account key
- In Firebase Console → Project Settings → Service accounts → Generate new private key.
- Save the JSON as `serviceAccountKey.json` in a secure location (do NOT commit it to git) or reference it via `--serviceAccount` when running scripts.

2) Deploy Firestore rules to production
- Login and select your project:

```bash
npm install -g firebase-tools
firebase login
firebase use --add  # select your existing project
```

- Deploy only the Firestore rules to your live project:

```bash
firebase deploy --only firestore:rules
```

- Verify the active rules in the Firebase Console (Firestore → Rules) after deployment.

3) Set / remove the `admin` claim (trusted environment only)
- Use the repository helper script (runs with a service account) to set or remove the admin custom claim:

```bash
node scripts/setAdminClaim.js --serviceAccount ./serviceAccountKey.json --email admin@example.com --admin true

node scripts/setAdminClaim.js --serviceAccount ./serviceAccountKey.json --uid <UID> --admin false
```

4) Verify the custom claim (client-side, after real sign-in)
- After setting a claim you must refresh the user's ID token. From the browser client:

```js
firebase.auth().currentUser.getIdTokenResult(true)
  .then(idTokenResult => console.log(idTokenResult.claims))
  .catch(console.error);
```

- Confirm `idTokenResult.claims.admin === true` before exposing admin-only UI.

5) Perform real verification on production
- Sign up or register a real test partner through your live site (use a test account you control).
- In the Firebase Console:
  - Confirm the new user appears under Authentication → Users.
  - Confirm the partner document appears under Firestore → partners with expected fields (`uid`, `name`, `email`, `referralCode`).
  - Attempt a read as the owner (sign in as that account in the client) and verify access succeeds; attempt the same read from a non-owner/non-admin account to confirm denial.

6) What the `firestore.rules` expect
- `partners/{partnerId}` creation requires `request.auth.uid == request.resource.data.uid` and the fields `uid`, `name`, `email`, `referralCode` to be present.
- Reading/updating a partner doc is allowed only for the owning `uid` or users with the `admin` custom claim.
- `commission_payments` collection is admin-only.

7) Security notes and best practices
- Only run `setAdminClaim.js` from a trusted environment (developer machine or a secure CI runner with restricted access).
- Do NOT commit service account JSON to source control; store it in secure secrets storage.
- For production, prefer a protected server-side endpoint or Cloud Function (callable) that performs claims assignment after verifying the request is from an authorized operator. Protect that endpoint using project IAM and internal checks.

8) Optional: automated verification (trusted admin environment)
- For repeatable checks, run a short privileged script using the Admin SDK to query the `partners` doc after a real registration and assert its contents. Keep such scripts only in secure admin tooling.

