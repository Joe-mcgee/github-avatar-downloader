let owner = process.argv[2];
let repo = process.argv[3];
const request = require('request');
const secrets = require('./secrets.js');
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');
//writes jpgs to an avatars folder
function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(err) {
      console.log(err);
    })
    .pipe(fs.createWriteStream(filePath));

}

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }

  };
  request(options, function(err, res, body) {
    //call back function starting at line 34
    cb(err, body);
  });
}
// if input is defined, execute function
if (typeof owner !== 'undefined' && typeof repo !== 'undefined') {
  getRepoContributors(owner, repo, function(err, result){
    let parsed = JSON.parse(result);
    let loginAvatarUrl = {};
    //cretes {'login name': 'avatar_url'} object
    parsed.forEach(function(contributor) {
      loginAvatarUrl[contributor['login']] = contributor['avatar_url'];
    });
    for (login in loginAvatarUrl) {
      downloadImageByURL(loginAvatarUrl[login], './avatars/' + login + '.jpg');
    }
  });
} else {
  console.log('please enter the owner and in the cmd line');
}





