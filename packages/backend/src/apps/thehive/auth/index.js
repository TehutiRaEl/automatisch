import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'screenName',
      label: 'Screen Name',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Screen name of your connection to be shown in the UI.',
      clickToCopy: false,
    },
    {
      key: 'hiveSigningSecret',
      label: 'Hive Signing Secret',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'The same HIVE_JWT_SECRET / jwt_secret_key value set on THEHIVE and every ' +
        'other colony — used to HMAC-SHA256-sign and verify dispatch events, not ' +
        'an OAuth token. Never sent anywhere except computed locally into request ' +
        'signatures.',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
