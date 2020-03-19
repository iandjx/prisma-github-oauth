const fetch = require("node-fetch");

const requestGithubToken = credentials =>
  fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(credentials)
  })
    .then(res => res.json())
    //.then(json => console.log(json))
    .catch(err => {
      throw new Error(JSON.stringify(err));
    });

const requestGithubUserAccount = token =>
  fetch(`https://api.github.com/user?access_token=${token}`)
    .then(res => res.json())
    .catch(err => {
      throw new Error(JSON.stringify(err));
    });

async function authorizeWithGithub(credentials) {
  //console.log(JSON.stringify(credentials));
  const requestToken = await requestGithubToken(credentials);
  const { access_token } = requestToken;
  //console.log(access_token);
  const githubUser = await requestGithubUserAccount(access_token);
  //console.log(githubUser);
  return { ...githubUser, access_token };
}

module.exports = {
  requestGithubToken,
  requestGithubUserAccount,
  authorizeWithGithub
};
