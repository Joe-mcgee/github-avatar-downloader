let owner = process.argv[2];
let repo = process.argv[3];
const request = require('request');
const fs = require('fs');
if (!fs.existsSync('./secrets.js')) {
  fs.writeFileSync('./secrets.js');
}
const secrets = require('./secrets.js');

function authorAndRepo(err, result) {
  let resultToJson = JSON.parse(result)
  let authorAndRepo = {};
  for (var i = 0; i < resultToJson.length; i++) {
    authorAndRepo[resultToJson[i]['owner']['login']] = resultToJson[i]['name']
  }
  console.log(authorAndRepo)
}

function getStarredUrls(URL, cb) {
  var options = {
    url: URL,
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    cb(err, body);
  });
}




function starFilter(err, result) {
  let parsed = JSON.parse(result);
  let loginStarredUrl = {};
  for (var i = 0; i < parsed.length; i++) {
    loginStarredUrl[parsed[i]['login']] = parsed[i]['starred_url'].replace(/{\/owner}{\/repo}/g, '');
  }
  for (var login in loginStarredUrl) {
    getStarredUrls(loginStarredUrl[login], authorAndRepo)
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

if (typeof owner !== 'undefined' && typeof repo !== 'undefined') {
  getRepoContributors(owner, repo, starFilter);
} else {
  console.log('please enter the owner and the repo in the cmd line');
}
