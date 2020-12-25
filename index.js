const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movie_api', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
 morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());





// app.get('/movies', (req, res) => {
//     res.json(topSciFiMovies);
// });

app.get('/', (req, res) => {
    res.send('Welcome to my special movies selection !');
});

// use express.static to serve “documentation.html” file 
app.use(express.static('public'));

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
  });

//using Morgan middleware to log all requests
app.use(morgan('common'));

app.listen(8080, () =>{
    console.log('My app is listening on port 8080.');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


// movies API requests......................................

// list of all movies
app.get('/movies', function(req, res) {
	res.json(topSciFiMovies)
  });

// data about a single movie by title
app.get('/movies/:title', (req, res) => {
	res.json(topSciFiMovies.find( (movie) =>
	  { return movie.title ===req.params.title}));
  });


// get  genre  by name
app.get('/genres/:name', (req, res) => {
	res.json(genres.find( (genre) =>
	  { return genre.name ===req.params.name }));
});


// Get  a single director by name
app.get('/directors/:name', (req, res) => {
	res.json(directors.find( (director) =>
	  { return director.name ===req.params.name }));
  });


//add a new user to users
// app.post('/users', (req, res) => {
// 	let newUser = req.body;
  
// 	if (!newUser.username) {
// 	  const message = 'Missing name in request body';
// 	  res.status(400).send(message);
// 	} else {
// 	  newUser.id = uuid.v4();
// 	  users.push(newUser);
// 	  res.status(201).send(newUser);
// 	}
// });

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
	Users.findOne({ Username: req.body.Username })
	  .then((user) => {
		if (user) {
		  return res.status(400).send(req.body.Username + 'already exists');
		} else {
		  Users
			.create({
			  Username: req.body.Username,
			  Password: req.body.Password,
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

// deregister a user by id
app.delete('/users/:id', (req, res) => {
	let user = users.find( (user) => {
	  return user.id === req.params.id });
  
	if (user) {
	  users = users.filter(function(obj) { return obj.id !==req.params.id });
	  res.status(201).send( user.username + ' was deleted.')
	}
});

// Update a user by a id
app.put("/users/:username", (req, res) => {
    res.send('Successful User information updated');
})

// Remove movies from user's list of favorites
app.delete('/users/:username/:movie_title', (req, res) => {
	let user = users.find( (user) => {
	  return user.username === req.params.username;
	});
	let movie = movies.find( (movie) => {
	  return movie.title === req.params.title;
	});
  
	if (user && movie) {
	  user.favorites = user.favorites.filter((movie_title) => { return movie_title !== req.params.movie_title; });
	  res.status(201).send('Movie with title ' + req.params.movie_title + ' was succesfully removed');
	} else if (!movie) {
	  res.status(404).send('Movie with title ' + req.params.movie_title + ' was not found.');
	} else {
	  res.status(404).send('User with username ' + req.params.username + ' was not found.');
	}
  });

// add movie to user's favotite list
app.post('/users/:username/favorites', (req, res) => {
	let newFavorites = req.body;
  
	if (!newFavorites.title) {
	  const message = 'Missing favorites in request body';
	  res.status(400).send(message);
	} else {
	  newFavorites.movie_id = uuid.v4();
	  users.favorites.push(newFavorites);
	  res.status(201).send(newFavorites);
	}
});
  
// delet a user 
app.delete("/users/:username", (req, res) => {
    let user = users.find((user) => {
        return user.username === req.params.username
    });
    if (user) {
        Users.filter(function(obj) {
            return obj.username !== req.params.username
        });
        res.status(201).send(req.params.username + " has been removed from registry .");
    }
});