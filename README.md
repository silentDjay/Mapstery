On my local machine, I've used Browserify as server proxy. To update the JS running on the server, run this command in the directory containing the JS files:

browserify scripts.js -o browserify.js

Then open the index.html file in the browser and you're good to go!

more information on Browserify: https://github.com/substack/browserify-handbook

Improvements still to implement


1. Click markers reveal which country was clicked (upon hoverover/click?)
2. positive and negative feedback to user varies based upon how many attempts/clicks remaining
3. Keep a record of previous countries clicked/not clicked and how many clicks it took to get it
4. Tell the user how far away from the desired country their last click was!!!!!
5. After three clicks, if the user isn't clicking in the correct continent, let them know (and then continue to let them know when they're in the right continent)
6. If the user is clicking on the right continent, name the countries that the target country borders in the hint (use data.borders, compare to country codes in original call to API to get country names)
