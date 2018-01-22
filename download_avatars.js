let owner = process.argv[2];
let repo = process.argv[3];
const request = require('request');
const secrets = require('./secrets.js');
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');



//writes jpgs to an avatars folder
function downloadImageByURL(url, filePath) {
  if (!fs.existsSync('./avatars')) {
    fs.mkdirSync('./avatars');
  }

  request.get(url)
    .on('error', function(err) {
      console.log(err);
    })
    .pipe(fs.createWriteStream(filePath));

}
// callback which  handles html to json to relevant data
function handleFilter(err, result) {
  let parsed = JSON.parse(result);
  let loginAvatarUrl = {};
  //cretes {'login name': 'avatar_url'} object
  parsed.forEach(function(contributor) {
    loginAvatarUrl[contributor['login']] = contributor['avatar_url'];
  });
  for (login in loginAvatarUrl) {
    downloadImageByURL(loginAvatarUrl[login], './avatars/' + login + '.jpg');
  }
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
    cb(err, body);
  });
}
// if input is defined, execute function
if (typeof owner !== 'undefined' && typeof repo !== 'undefined') {
  getRepoContributors(owner, repo, handleFilter);
} else {
  console.log('please enter the owner and the repo in the cmd line');
}


