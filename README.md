On my local machine, I've used Browserify as server proxy. To update the JS running on the server, run this command in the directory containing the JS files:

browserify scripts.js -o browserify.js

Then open the index.html file in the browser and you're good to go!

more information on Browserify: https://github.com/substack/browserify-handbook

Improvements still to implement:

* positive and negative feedback to user varies based upon how many attempts/clicks remaining
* Keep a record of previous countries clicked/not clicked and how many clicks it took to get it
* Tell the user how far away from the desired country their last click was!!!!!
* After three clicks, if the user isn't clicking in the correct continent, let them know what continent the target country is in (and then continue to let them know when they've clicked in the right continent on subsequent guesses)
* If they are in the right continent, give them the detailed hint with region and border country names

Bugs to fix:

* countries like Heard Island and McDonald Islands don't have a subregion, so there's no real hint
