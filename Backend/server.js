const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const connectDB = require("./config/dbConn");
connectDB();

const admin = require('firebase-admin');
const db = admin.firestore();
const PORT = process.env.PORT || 3500;
app.use(bodyParser.json());
app.use(cors());


app.use(require("./routes/getRoutes"));
app.use(require("./routes/postRoutes"));
app.use(require("./routes/putRoutes"));
app.use(require("./routes/deleteRoutes"));


db.listCollections()
  .then(() => {
    console.log('Connected to Firebase');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to Firebase:', err);
  });
