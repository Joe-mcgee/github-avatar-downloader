
let owner = process.argv[2];
let repo = process.argv[3];
const request = require('request');
const fs = require('fs');
if (!fs.existsSync('./secrets.js')) {
  fs.writeFileSync('./secrets.js');
}
const secrets = require('./secrets.js');

function authorAndRepo(err, result) {
  let resultToJson = result;
  let authorAndRepo = {};
  for (var i = 0; i < resultToJson.length; i++) {
    authorAndRepo[resultToJson[i]['owner']['login']] = resultToJson[i]['name'];
  }
/*  console.log(authorAndRepo)*/
 return authorAndRepo
  }


async function getStarredUrls(URL, cb, motherArray, goldObj) {
  var options = {
    url: URL,
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };


  var newOut = await request(options, function(err, res, body) {
    var newBody = JSON.parse(body);
    var  output = cb(err, newBody);
    motherArray.push(output)
    /*console.log(motherArray)*/
    motherArray.forEach(function (outputs) {
      for (name in outputs) {
        if (goldObj[name + ' / ' + outputs[name]]) {
          goldObj[name + ' / ' + outputs[name]] += 1
        } else {
          goldObj[name + ' / ' + outputs[name]] = 1

      }
    }
    motherArray.shift(outputs)

    /*console.log(motherArray)*/
    })
    let sorted = []
    for (gitRepo in goldObj) {
      sorted.push([goldObj[gitRepo], gitRepo])
    }
    sorted.sort((a, b) => { return b[0]-a[0]})
    sorted.length = 5;
    sorted.forEach((top) => {
      let star = top[0];
      let newstar = '[ '+star+' stars ]'
      top[0] = newstar
      let oldTop = top[1];
      let newTop = oldTop
      top[1] = newTop
    })



    let goldJson = JSON.stringify(sorted)
    fs.writeFile('starred-gits.txt', goldJson, (err) => {
      if(err) throw err;
    })

    return goldObj
  });
  return newOut
}



async function starFilter(err, result) {
  let parsed = JSON.parse(result);
  let loginStarredUrl = {};

  for (var i = 0; i < parsed.length; i++) {
    loginStarredUrl[parsed[i]['login']] = parsed[i]['starred_url'].replace(/{\/owner}{\/repo}/g, '');
  }
  const outputObject = {}
  let goldArray = [];
  //console.log('urls obj', loginStarredUrl)
  for (var login in loginStarredUrl) {
    var list = await getStarredUrls(loginStarredUrl[login], authorAndRepo, goldArray, outputObject);
  }
  console.log(goldArray)
  /*console.log(goldArray)*/
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





