require('dotenv').config()
const connectionLink =
  `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@click-net-database.frukd5u.mongodb.net/?retryWrites=true&w=majority`;
const mongoose = require("mongoose");

const connect = (connectionLink, connectedCallback) => {
  mongoose
    .connect(connectionLink)
    .then(() => {
      console.info("Connected to database.");
      connectedCallback();
    })
    .catch((error) => {
      console.info(error);
    });
};

module.exports = {
  connect,
  connectionLink,
};
