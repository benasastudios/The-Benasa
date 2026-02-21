#!/usr/bin/env node
const admin = require('firebase-admin');
const fs = require('fs');

function getArg(name) {
  const idx = process.argv.indexOf('--' + name);
  return idx > -1 ? process.argv[idx + 1] : null;
}

const serviceAccountPath = getArg('serviceAccount') || './serviceAccountKey.json';
const email = getArg('email');
const uidArg = getArg('uid');
const adminFlag = getArg('admin'); // "true" or "false"

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account JSON not found at', serviceAccountPath);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath))
});

async function setClaimForUid(uid, isAdmin) {
  await admin.auth().setCustomUserClaims(uid, { admin: !!isAdmin });
  console.log(`Set admin=${isAdmin} for uid=${uid}`);
}

async function main() {
  if (!adminFlag) {
    console.error('Missing --admin flag. Usage example: --admin true');
    process.exit(1);
  }
  const isAdmin = adminFlag.toLowerCase() === 'true';

  try {
    let uid = uidArg;
    if (!uid && email) {
      const user = await admin.auth().getUserByEmail(email);
      uid = user.uid;
    }

    if (!uid) {
      console.error('Provide --uid <UID> or --email <user@example.com>');
      process.exit(1);
    }

    await setClaimForUid(uid, isAdmin);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
