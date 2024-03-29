require('dotenv').config()
const connectionLink =
`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster-click-net-dev.fl4z0p3.mongodb.net/`
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const connect = (connectionLink, connectedCallback) => {
  mongoose
    .connect(connectionLink)
    .then(() => {
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
