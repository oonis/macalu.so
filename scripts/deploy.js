const ghpages = require("gh-pages");

ghpages.publish(
  'public',
  {
    branch: 'master',
    repo: 'https://github.com/oonis/oonis.github.io.git'
  },
  () => {
    console.log('Deploy completed');
  }
);
