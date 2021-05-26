import admin from '../../src/firebase';

const getIdToken = async uid => {
  const customToken = await admin.auth().createCustomToken(uid)
  const payload  = {
    token: customToken,
    returnSecureToken: true
  }
  const res = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  return (await res.json()).idToken;
};

export { getIdToken }