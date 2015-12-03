# networx
nworx.co.uk

This is the code for nworx.co.uk
The website is a nodeJS (MEAN stack) microblogging site like Twitter, it allows a user to post to their timeline
and that post is automatically picked up by their followers. Private posts can also be created by using an @ sign
at the start of the message. Then only the @username will pick up the message. The targeted user will receive the
message whether they are following the poster or not.
A post with @username in the middle (not at the beginning) will go out to all followers and also be picked 
up by the targeted user whether they are following the poster or not. 
Posts are limited to 140 characters.

If you would like to browse the site without creating an account then use the guest account

Username: guest

password: guest


Structure of the code:

The basis of the server is found in server.js, which runs on Express. This server file then "requires" (ie pulls in) routes.js which holds all the get and post routes. The models, views, and controllers folders are self explanatory. Routes.js directs requests to the right controller js file, and that controller then uses mongoose to query the mongoDB database. The result is mostly rendered with EJS from Routes.js into the appropriate view file (inside views folder).

The views use angular to GET and POST requests to the server and the result is bound to the HTML DOM elements on the page. If you're wondering why pages uses both EJS and Angular for displaying data it is because the EJS variables are set before the page is opened and Angular variables are set after the page has rendered. 
