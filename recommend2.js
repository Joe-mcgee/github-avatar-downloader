function getRepoContributors(owner, repo, callback) {
  return new Promise((resolve, reject) => {
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
  })
}
