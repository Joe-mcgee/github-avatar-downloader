const request = require('request');
const secrets = require('secrets.js')

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributiors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }

  };
  request(options, function(err, res, body) {
    cb(err, body);
  });
}


getRepoContributiors('jquery', 'jquery', function(err, result){

  console.log("Errors:", err);
  console.log("Result:", result);
});
