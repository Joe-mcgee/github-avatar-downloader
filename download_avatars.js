const request = require('request');
const secrets = require('./secrets.js');
const fs = require('fs');

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

    cb(err, body);
  });
}


getRepoContributors('jquery', 'jquery', function(err, result){
  let parsed = JSON.parse(result);
  let loginAvatarUrl = {};
  parsed.forEach(function(contributor) {
      loginAvatarUrl[contributor['login']] = contributor['avatar_url'];
    });

  for (login in loginAvatarUrl) {
    /*try {
      fs.writeFileSync('/avatars/' + login + '.jpg')
    } catch (e) {
      console.log('cannot write file', e)
    }*/
    downloadImageByURL(loginAvatarUrl[login], './avatars/' + login + '.jpg');
  }
});


function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(err) {
      console.log(err);
    })
    .on('response', function(response) {

    })
    .pipe(fs.createWriteStream(filePath));

}


