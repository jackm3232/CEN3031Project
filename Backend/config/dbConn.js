const admin = require('firebase-admin');
require("dotenv").config();

const connectDB = () => {
  try {
    admin.initializeApp ({
      credential: admin.credential.cert({
        type: "service_account",
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
        universe_domain: process.env.UNIVERSE_DOMAIN
      }),
      databaseURL: process.env.DATABASE_URL
    });
  }
  catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
