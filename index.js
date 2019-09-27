const { nextISSTimesForMyLocation , printTimes } = require('./iss');


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log(error);
    return;
  }

  printTimes(passTimes);
})
