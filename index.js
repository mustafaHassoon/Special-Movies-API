const express = require('express'),
 morgan = require('morgan');
const app = express();

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


//

app.get('/movies', (req, res) => {
    res.json(topSciFiMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to my special movies selection !');
});

app.use(express.static('public'));

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
  });

app.use(morgan('common'));

app.listen(8080, () =>{
    console.log('My app is listening on port 8080.');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });