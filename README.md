On my local machine, I've used Browserify as server proxy. To update the JS running on the server, run this command in the directory containing the JS files:

browserify scripts.js -o browserify.js

Then open the index.html file in the browser and you're good to go!

more information on Browserify: https://github.com/substack/browserify-handbook

Improvements still to implement:

* positive and negative feedback to user varies based upon how many attempts/clicks remaining
* Keep a record of previous countries clicked/not clicked and how many clicks it took to get it
* Tell the user how far away from the desired country their last click was!!!!!
* If the user clicks on a country that borders the target country, tell them!
* Otherwise, any time after 6 clicks, give them the detailed hint with region and border country names

Bugs to fix:
