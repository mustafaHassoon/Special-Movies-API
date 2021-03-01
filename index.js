const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;



// mongoose.connect('mongodb://localhost:27017/movie_api', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb+srv://mustafaHassoon:Mm07706056635@movieapi.yigk8.mongodb.net/movieAPIDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const express = require('express'),
 morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

//importing auth.js
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// use express.static to serve “documentation.html” file 
app.use(express.static('public'));

//using Morgan middleware to log all requests
app.use(morgan('common'));

const { check, validationResult } = require('express-validator');

//..........................................................
//implementing cors
const cors = require('cors');

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com','http://localhost:1234'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));


// movies API requests......................................

// start
app.get('/', (req, res) => {
  res.send('<h1>' + '<b>Welcome to my special collection of movies !<b>' + '</h1>')
})

// Movies

// Get movies and details
app.get('/movies',(req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
  // Get movie by title
  app.get('/movies/:Title', function(req, res) {
	Movies.findOne({ Title : req.params.Title })
	.then(function(movie) {
	  res.json(movie)
	})
	.catch(function(err) {
	  console.error(err);
	  res.status(500).send("Error: " + err);
	});
  });
  //Get a movie by genre
  app.get('/movies/genres/:Name', function(req, res) {
	Movies.findOne({'Genre.Name': req.params.Name})
	.then(function(movies){
	  res.json(movies.Genre)
	  })
	.catch(function(err) {
	  console.error(err);
	  res.status(500).send("Error:" + err);
	});
  });
  
  //Find a movie genre 
  app.get('/movies/genres/:Title', function(req, res) {
	Movies.findOne({Title: req.params.Title})
	.then(function(movie){
	  if(movie){
		res.status(201).send("Movie with the title : " + movie.Title + " is  a " + movie.Genre.Name + " ." );
	  }else{
		res.status(404).send("Movie with the title : " + req.params.Title + " was not found.");
		  }
	  })
	.catch(function(err) {
	  console.error(err);
	  res.status(500).send("Error:" + err);
	});
  });
  
  //Get a director by name
  app.get('/movies/directors/:Name', function(req, res) {
	Movies.findOne({"Director.Name" : req.params.Name})
	.then(function(movies){
	  res.json(movies.Director)
	})
	.catch(function(err) {
	  console.error(err);
	  res.status(500).send("Error:" + err);
	});
  });

  //Add a movie 
  app.post("/movies", (req, res, next) => {
	let newmovie = req.body;
  
	if (!newmovie.title) {
	  const message = "Missing title in request body";
	  res.status(400).send(message);
  
	} else {
	  newmovie.id = uuid.v4();
	  Movies.push(newmovie);
	  res.status(201).send(newmovie);
	}
  });
  //Update a movie
  app.put("/movies/:title", (req, res, next) => {
	
	let movieTitle = req.params.title;
	let movie = Movies.find((movie) => movie.title === movieTitle);
  
	if (movie) {
	  movie.title = req.body.title,
	  movie.director = req.body.director,
	  movie.genre = req.body.genre,
	  movie.year = req.body.year
	  res.status(201).send("This movie" + req.params.title + "was assigned a new parameter");
  
  } else {
	res.status(404).send("Movie with the title" + req.params.title + "was not found.")
  }
  }),
  //Delete a movie
  app.delete("/movies/:title", (req, res, next) => {
	let movie = Movies.find((movie) => {
	  return movie.title === req.params.title
	});
  
	if (movie) {
	  Movies.filter(function(obj) {
		return obj.title !== req.params.title
	  }),
	  res.status(201).send("Movie"  + req.params.title +  "was deleted from the list.")
	}
  });


// Users

//Add a user
app.post('/users',
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {

  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
	Users.findOne({ Username: req.body.Username })
	  .then((user) => {
		if (user) {
		  return res.status(400).send(req.body.Username + 'already exists');
		} else {
		  Users
			.create({
			  Username: req.body.Username,
			  Password: hashedPassword,
			  Email: req.body.Email,
			  Birthday: req.body.Birthday
			})
			.then((user) =>{res.status(201).json(user) })
		  .catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		  })
		}
	  })
	  .catch((error) => {
		console.error(error);
		res.status(500).send('Error: ' + error);
	  });
  });
// Users
//Get a list of users
app.get('/users', function(req, res) {

  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
//Get a user by username
app.get('/users/:Username', function(req, res) {
  Users.findOne({ Username : req.params.Username })
  .then(function(user) {
    res.json(user)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Update a user
app.put(
  '/users/:Username',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    let hashedPassword = Users.hashPassword(req.body.Password)
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err)
          res.status(500).send('Error: ' + err)
        } else {
          res.json(updatedUser)
        }
      }
    )
  }
)
//Add a favorite movie 
app.post('/users/:Username/Movies/:MovieID', function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, {
    $push : { Favorit_movie : req.params.MovieID }
  },
  { new : true }, // This line makes sure that the updated document is returned
  function(err, updatedUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});
//Delete a favorite movie
app.delete('/users/:Username/Movies/:MovieID', function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, {
    $pull : { Favorit_movie : req.params.MovieID }
  },
  { new : true }, // This line makes sure that the updated document is returned
  function(err, updatedUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});
//Delete a user
app.delete('/users/:Username', function(req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then(function(user) {
    if (!user) {
      res.status(400).send(req.params.Username + " was not found");
    } else {
      res.status(200).send(req.params.Username + " was deleted.");
    }
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

