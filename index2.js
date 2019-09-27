const { nextISSflyOvers } = require('./iss_promised');

nextISSflyOvers()
  .catch((error) => {
    console.log("Failure: " + error);
  });