// No external verify call: hiveSigningSecret is a symmetric HMAC key shared
// with THEHIVE and every colony, not an OAuth token or API key with its own
// "whoami" endpoint to ping. There's nothing to verify against except that
// a value was actually provided.
const verifyCredentials = async ($) => {
  if (!$.auth.data?.hiveSigningSecret) {
    throw new Error('Hive Signing Secret is required.');
  }

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
