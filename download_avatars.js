const request = require('request');
const secrets = require('./secrets.js')

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }

  };
  request(options, function(err, res, body) {
    let parsed = JSON.parse(body)
    let avaURLS = []
    parsed.forEach(function(contributor) {
      avaURLS.push(contributor['avatar_url'])
    })
    cb(err, body, avaURLS);
  });
}


getRepoContributors('jquery', 'jquery', function(err, result, target){
  console.log("Errors:", err);
  console.log('URLS to Avatars: ', target)
});
