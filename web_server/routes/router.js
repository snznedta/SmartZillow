var express = require('express');
var passwordHash = require('password-hash');
var session = require('client-sessions');
var User = require('../model/user');
var rpc_client = require('../rpc_client/rpc_client')
var router = express.Router();

TITLE = 'Smart Zillow';

/* Index page */
router.get('/', function(req, res, next) {
  var user = checkLoggedIn(req, res)
  res.render('index', { title: TITLE, logged_in_user: user});
});

/* Search page */
router.get('/search', function(req, res, next) {
  var query = req.query.search_text;
  console.log("search text: " + query)

  rpc_client.searchArea(query, function(response) {
    results = [];
    if (response == undefined || response === null) {
      console.log("No results found");
    } else {
      results = response;
    }

    // Add thousands separators for numbers.
    //addThousandSeparatorForSearchResult(results)

    res.render('search_result', {
      title: TITLE,
      query: query,
      results: results
    });

  });
});

/* Login page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: TITLE });
});

/* Login submit */
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  User.find({ email : email }, function(err, users) {
    console.log(users);
    if (err) throw err;
    // User not found.
    if (users.length == 0) {
      res.render('login', {
        title : TITLE,
        message : "User not found. Or <a href='/register'>rigester</a>"
      });
    } else {
      // User found.
      var user = users[0];
      if (passwordHash.verify(password, user.password)) {
        req.session.user = user.email;
        res.redirect('/');
      } else {
        res.render('login', {
          title : TITLE,
          message : "Password incorrect. Or <a href='/register'>rigester</a>"
        });
      }
    }
  });
});

/* Register page */
router.get('/register', function(req, res, next) {
  res.render('register', { title: TITLE });
});

/* Register submit */
router.post('/register', function(req, res, next) {
  // Get form values.
  var email = req.body.email;
  var password = req.body.password;
  var hashedPassword = passwordHash.generate(password);

  // Check if the email is already used.
  User.find({ email : email }, function(err, users) {
    if (err) throw err;
    if (users.length > 0) {
      console.log("User found for: " + email);
      res.render('register', {
        title: TITLE,
        message: 'Email is already used. Please pick a new one. Or <a href="/login">Login</a>'
      });
    } else {
        var newUser = User({
          email : email,
          password : hashedPassword,
        });
        // Save the user.
        newUser.save(function(err) {
          if (err) throw err;
          console.log('User created!');
          req.session.user = email;
          res.redirect('/');
        });
    }
  });
});

/* Logout */
router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

function checkLoggedIn(req, res) {
  // Check if session exist
  if (req.session && req.session.user) { 
    return req.session.user;
  }
  return null;
}

module.exports = router;
