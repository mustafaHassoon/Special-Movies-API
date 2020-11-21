const express = require('express'),
 morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// list of movies
let topSciFiMovies = [
	{
		"movie_id" : 1,
		"title" : "Akira",
		"category_name" : "Science Fiction",
		"edition" : "Signature Series",
		"release_year" : 1987,
		"running_time" : 124,
		"rating_name" : "R",
		"disc_format_name" : "DVD",
		"number_discs" : 1,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 1.78:1",
		"status" : 1,
		"time_stamp" : "2006-01-02"
	},
	{
		"movie_id" : 2,
		"title" : "Alien",
		"category_name" : "Science Fiction",
		"edition" : "Blu-ray Quadrilogy Edition",
		"release_year" : 1979,
		"running_time" : 116,
		"rating_name" : "R",
		"disc_format_name" : "Blu-ray",
		"number_discs" : 1,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 2.35:1",
		"status" : 1,
		"time_stamp" : "2015-09-19"
	},
	{
		"movie_id" : 3,
		"title" : "Aliens",
		"category_name" : "Science Fiction",
		"edition" : "Blu-ray Quadrilogy Edition",
		"release_year" : 1986,
		"running_time" : 137,
		"rating_name" : "R",
		"disc_format_name" : "Blu-ray",
		"number_discs" : 1,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 1.85:1",
		"status" : 1,
		"time_stamp" : "2015-09-19"
	},
	{
		"movie_id" : 4,
		"title" : "Avatar",
		"category_name" : "Science Fiction",
		"edition" : "Extended Blu-Ray Collector Edition",
		"release_year" : 2009,
		"running_time" : 178,
		"rating_name" : "PG-13",
		"disc_format_name" : "Blu-ray",
		"number_discs" : 3,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 1.78:1",
		"status" : 1,
		"time_stamp" : "2011-02-25"
	},
	{
		"movie_id" : 5,
		"title" : "Blade Runner",
		"category_name" : "Science Fiction",
		"edition" : "30th Anniversary Collectors Edition",
		"release_year" : 1992,
		"running_time" : 117,
		"rating_name" : "R",
		"disc_format_name" : "Blu-ray",
		"number_discs" : 3,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 2.78:1",
		"status" : 1,
		"time_stamp" : "2012-10-25"
	},
	{
		"movie_id" : 6,
		"title" : "Chappie",
		"category_name" : "Science Fiction",
		"edition" : "Blu-ray Edition",
		"release_year" : 2015,
		"running_time" : 120,
		"rating_name" : "R",
		"disc_format_name" : "Blu-ray",
		"number_discs" : 1,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 2.40:1",
		"status" : 1,
		"time_stamp" : "2015-07-19"
	},
	{
		"movie_id" : 7,
		"title" : "Children of Men",
		"category_name" : "Science Fiction",
		"edition" : "Widescreen Edition",
		"release_year" : 2007,
		"running_time" : 110,
		"rating_name" : "R",
		"disc_format_name" : "DVD",
		"number_discs" : 10,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 1.85:1",
		"status" : 1,
		"time_stamp" : "2007-05-07"
	},
	{
		"movie_id" : 8,
		"title" : "Cloud Atlas",
		"category_name" : "Science Fiction",
		"edition" : "Blu-ray + DVD Edition",
		"release_year" : 2013,
		"running_time" : 172,
		"rating_name" : "R",
		"disc_format_name" : "Blu-ray + DVD",
		"number_discs" : 1,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 1.78:1",
		"status" : 1,
		"time_stamp" : "2014-04-28"
	},
	{
		"movie_id" : 9,
		"title" : "Dark City",
		"category_name" : "Science Fiction",
		"edition" : "New Line Platinum Series",
		"release_year" : 1998,
		"running_time" : 96,
		"rating_name" : "R",
		"disc_format_name" : "DVD",
		"number_discs" : 1,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 1.78:1",
		"status" : 1,
		"time_stamp" : "2006-01-02"
	},
	{
		"movie_id" : 10,
		"title" : "Dawn of the Planet of the Apes",
		"category_name" : "Science Fiction",
		"edition" : "Blu-ray + Digital HD",
		"release_year" : 2014,
		"running_time" : 130,
		"rating_name" : "PG-13",
		"disc_format_name" : "Blu-ray",
		"number_discs" : 1,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 1.85:1",
		"status" : 1,
		"time_stamp" : "2014-12-07"
    }
];

//list of genre

let genres = [ {
	name : 'Fantasy',
	description : 'A fantasy story is about magic or supernatural forces,... '
},
{
	name : 'Science Fiction',
	description : 'Science fiction film (or sci-fi film) is a genre that ... '
},
{
	name : 'Adventure',
	description : 'Adventure films are a genre of film that typically use their action... '
},
{
	name : 'Drama',
	description : 'Dramas are serious, plot-driven presentations, portraying realistic characters,... '
},
{
	name : 'Comedy',
	description : 'Comedies are light-hearted plots consistently and deliberately designed to amuse... '
},
{
	name : 'Crime',
	description : 'Crime films, in the broadest sense, are a film genre inspired by and ... '
},
{
	name : 'Epic',
	description : 'Epic films are a style of filmmaking with large scale, sweeping scope, and spectacle... '
},
{
	name : 'Computer animated',
	description : 'Computer animation is the process used for digitally generating animated images... '
},
{
	name : 'Action',
	description : 'Action films usually include high energy, big-budget physical stunts and chases, ... '
}
];

//list of directors
let directors = [ {
    name : 'Chris Columbus',
    bio : 'Christopher Joseph Columbus is an American film director, …, for Best Comedy Film. ',
    birth: '1958',
   death: ' '
},
{
    name : 'Robert Zemeckis',
    bio :  ' Robert Lee Zemeckis is an American director, …, has used special effects to more dramatic and narrative purpose.',
    birth: '1951',
    death: ' '
},
{
    name : 'Steven Spielberg',
    bio :  'Steven Allan Spielberg is considered one of the… most popular directors and producers in film history.',
    birth: '1946',
    death: ' '
},
{
    name : 'Baz Luhrmann',
    bio :  'Mark Anthony "Baz" Luhrmann is an Australian film director, …and Nicole Kidman. ',
    Birth: '1962',
    death: ' '
},
{
    name : 'J.J. Abrams',
    bio :  'Abrams has created numerous television series, including Felicity, …the saga, Star Wars: The Rise of Skywalker (2019).',
    Birth: '1966',
    death: ' '

},
{
    name : 'John Landis',
    bio :  'John Landis is an American film director, screenwriter, actor, …, music videos with singer Michael Jackson.',
    Birth: '1950',
    death: ' '
},
{
    name : 'Quentin Tarantino',
    bio :  'Quentin Jerome Tarantino is an American film director, screenwriter, …, born in Queens, New York.',
    Birth: '1963',
    death: ' '
},
{
    name : 'Christopher Nolan',
    bio :  'Christopher Edward Nolan, is a British-American film director, …, and his brother, screenwriter Jonathan Nolan.',
    Birth: '1970',
    death: ' '
},
{
    name : 'Jon Favreau',
    bio :  'Jonathan Favreau is an American actor, director, …., as co-producers in most of Favreau\'s directorial ventures.',
    Birth: '1966',
    death: ' '
},
{
    name : 'Jon Watts',
    bio :  'Jon Watts is an American film director, producer and… ,… on his chest to make himself "stand out in the field.',
    Birth: '1981',
    death: ' '
}
];

//example list of users

let users = [ {
	id : '0',
	username : 'Mustafa Mahdi',
	password : '12345678',
	email : 'm.mahdi@example.com',
	birthday : '1990-02-16',
	favorites : [{
		"movie_id" : 11,
		"title" : "District 9",
		"category_name" : "Science Fiction",
		"edition" : "Widescreen Edition",
		"release_year" : 2009,
		"running_time" : 112,
		"rating_name" : "R",
		"disc_format_name" : "DVD",
		"number_discs" : 1,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 1.85:1",
		"status" : 1,
		"time_stamp" : "2010-01-02"
	}]
	},
	{
	id : '1',
	username : 'Joe Biden',
	password : '87654321',
	email : 'j.biden@example.com',
	birthday : '1942-11-20',
	favorites : [{
		"movie_id" : 15,
		"title" : "Fifth Element",
		"category_name" : "Science Fiction",
		"edition" : "Blu-ray Edition",
		"release_year" : 2007,
		"running_time" : 126,
		"rating_name" : "PG-13",
		"disc_format_name" : "Blu-ray",
		"number_discs" : 1,
		"viewing_format_name" : "Widescreen",
		"aspect_ratio_name" : " 2.40:1",
		"status" : 1,
		"time_stamp" : "2013-08-01"
	}]
	},
  ];


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

//list of genres
// app.get('/genres', function(req, res) {
// 	res.json(genres)
// });

// get  genre  by name
app.get('/genres/:name', (req, res) => {
	res.json(genres.find( (genre) =>
	  { return genre.name ===req.params.name }));
});

// Get the list of All directors
// app.get('/directors', function (req, res) {
// 	res.json(directors)
// });

// Get  a single director by name
app.get('/directors/:name', (req, res) => {
	res.json(directors.find( (director) =>
	  { return director.name ===req.params.name }));
  });

// Get a list of all users
// app.get('/users', function(req, res) {
// 	res.json(users);
// });

// Get a single user by username
// app.get('/users/:username', (req, res) => {
// 	res.json(users.find( (user) =>
// 	  { return user.username ===req.params.username  }));
// });

//add a new user to users
app.post('/users', (req, res) => {
	let newUser = req.body;
  
	if (!newUser.username) {
	  const message = 'Missing name in request body';
	  res.status(400).send(message);
	} else {
	  newUser.id = uuid.v4();
	  users.push(newUser);
	  res.status(201).send(newUser);
	}
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