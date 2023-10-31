const mongoose = require('mongoose')

function DBconnected () {
  mongoose
  .connect(process.env.DB_URI)
  .then((res) => {
    console.log("connection is ready : ", res.connection.host);
  })
  .catch((e) => {
    console.log("error", e);
  });
}

module.exports = DBconnected