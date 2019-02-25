require("dotenv").config();
var axios = require("axios");
var request = require("request");
var moment = require("moment");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var commandArg = process.argv[3];

function concertThis(artist) {
  console.log("artist", artist);
  var uri = encodeURI(
    "https://rest.bandsintown.com/artists/" +
      artist +
      "/events?app_id=codingbootcamp"
  );
  request(uri, function(err, response, body) {
    console.log("body: ", body, ".");
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
  });
}
function spotifyThisSong(songName) {
  if (songName === undefined) {
    songName = "The Sign Ace of Base";
  }
  spotify.search({ type: "track", query: songName, limit: 1 }, function(
    err,
    data
  ) {
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
  });
}

function movieThis(movieName) {
  if (movieName === undefined) {
    movieName = "Mr. Nobody";
  }
  axios
    .get(
      encodeURI(
        "http://www.omdbapi.com/?t=" +
          movieName.trim() +
          "&y=&plot=short&apikey=trilogy"
      )
    )
    .then(function(response) {
      console.log("Movie Title: " + response.data.Title);
      console.log("Movie Year: " + response.data.Year);
      console.log("Movie Rating via IMDB: " + response.data.imdbRating);
      console.log(
        "Movie Rating via Rotten Tomatoes: " + response.data.Ratings[1].Value
      );
      console.log("Movie Production Country: " + response.data.Country);
      console.log("Movie Language: " + response.data.Language);
      console.log("Movie Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
    })
    .catch(err => console.error(err));
}

function didDone() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    // We will then print the contents of data
    console.log(data);
    var dataArr = data.split(",");
    console.log(dataArr);
    if (dataArr[0] === "spotify-this-song") {
      spotifyThisSong(dataArr[1]);
    }
    if (dataArr[0] === "concert-this") {
      concertThis(dataArr[1]);
    }
    if (dataArr[0] === "movie-this") {
      movieThis(dataArr[1]);
    }
  });
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
