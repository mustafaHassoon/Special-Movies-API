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



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


// movies API requests......................................

// Movies

// Get movies and details
app.get('/movies', function(req, res) {

	Movies.find()
	.then(function(movies) {
	  res.status(201).json(movies)
	})
	.catch(function(err) {
	  console.error(err);
	  res.status(500).send("Error: " + err);
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
app.put('/users/:Username', function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, 
  { $set :
    {
    Username : req.body.Username,
    Name : req.body.Name,
    Password : req.body.Password,
    Email : req.body.Email,
    Birth_date : req.body.Birth_date
        }},

  { new : true },

  function(err, updatedUser) {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});
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

app.listen(8080, () =>{
    console.log('My app is listening on port 8080.');
});