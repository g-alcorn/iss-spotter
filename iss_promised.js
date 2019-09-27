const request = require('request-promise-native');

const fetchMyIP = function() {
  const ipurl = 'https://api.ipify.org?format=json';
  return request(ipurl);
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  const locationURL = `https://ipvigilante.com/${ip}`;
  return request(locationURL);
};

const fetchISSFlyOverTimes = function(coords) {
  const lat = JSON.parse(coords).data.latitude;
  const long = JSON.parse(coords).data.longitude;
  const requestURL = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${long}`;
  return request(requestURL);
};

const printTimes = function(flyovers) {
  const data = JSON.parse(flyovers).response;
  for (const pass of data) {
    const utc = new Date(0);
    utc.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass: ${utc}\nDuration: ${duration}s\n`);
  }
};

const nextISSflyOvers = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      printTimes(data);
    });
}

//exports
module.exports = { nextISSflyOvers };