/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');



const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const ipurl = 'https://api.ipify.org?format=json';
  request(ipurl, (err, response, body) => {
    if (err) {
      return callback(err, null);
    } else if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    } else {
      let ip = JSON.parse(body).ip;
      callback(null, ip);
    }
  });
};

const fetchCoordsByIP = function(ip, callback) {
  const coordUrl = 'https://ipvigilante.com/';

  request(coordUrl + ip, (err, response, body) => {
    let location = JSON.parse(body);
    if (err || location.status === 'error' || response === 400) {
      callback(new Error(`Error! \n${location.errors[0].code}`), null);
      return;
    }

    let lat = location.data.latitude;
    let long = location.data.longitude;
    let coords = {
      lat,
      long
    };

    callback(null, coords);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  let requestURL = `http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.long}`;
  request(requestURL, (err, response, body) => {
    if (err || response.statusCode !== 200) {
      callback(new Error('Failed to download flyover times!'), null);
      return;
    }

    let data = JSON.parse(body).response;
    callback(null, data);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        callback(error, null);
        return;
      }

      fetchISSFlyOverTimes(coordinates, (error, flyoverData) => {
        if (error) {
          callback(error, null);
          return;
        }

        callback(null, flyoverData);
      });
    });
  });
};

const printTimes = function(passes) {
  for (const pass of passes) {
    const utc = new Date(0);
    utc.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass: ${utc}\nDuration: ${duration}s\n`);
  }
};

module.exports = { nextISSTimesForMyLocation , printTimes };