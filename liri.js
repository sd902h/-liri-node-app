require("dotenv").config();
var request = require("request");
var moment = require("moment");
// var fs = require("fs");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var commandArg = process.argv[3];

function concertThis(artist) {
  request(
    "https://rest.bandsintown.com/artists/" +
      artist +
      "/events?app_id=codingbootcamp",
    function(err, response, body) {
      // console.log(response);
      if (err) {
        return console.log("Error occurred: " + err);
      }
      var bandInput = JSON.parse(body);
      if (bandInput.length > 0) {
        for (i = 0; i < 1; i++) {
          console.log(`Venue: ${bandInput[i].venue.name}`);
          console.log(`Venue Location via City: ${bandInput[i].venue.city}`);
          console.log(
            `Event Date/Time: ${moment(bandInput[i].datetime).format(
              "MM/DD/YYYY hh:00 A"
            )}`
          );
        }
      }
    }
  );
}
function spotifyThisSong(songName) {
  spotify.search({ type: "track", query: songName }, function(err, data) {
    var songsInfo = data.tracks.items;

    if (err) {
      return console.log("Error occurred: " + err);
    }
    for (i = 0; i < songsInfo.length; i++) {
      // console.log(songsInfo);
      console.log(`Artist: ${songsInfo[i].artists[0].name}`);
      console.log(`Song Name: ${songsInfo[i].name}`);
      console.log(`Preview Link: ${songsInfo[i].preview_url}`);
      console.log(`Album: ${songsInfo[i].album.name}`);
    }
    if (songName === undefined) {
      songName = "The Sign";
    }
  });
}

function movieThis() {
  console.log("running movie-this");
}

function didDone() {
  console.log("running did");
}

if (command === "concert-this") {
  concertThis(commandArg);
} else if (command === "spotify-this-song") {
  spotifyThisSong(commandArg);
} else if (command === "movie-this") {
  movieThis(commandArg);
} else if (command === "do-what-it-says") {
  didDone();
} else {
  console.log("invalid command");
}

// switch (command) {
//   case "concert-this":
//     console.log("running ct");
//     break;
//   case "other":
//     console.log("other");
//     break;
//   default:
//     console.log("invalid command");
// }
