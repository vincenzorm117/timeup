require('dotenv').config()
// 3rd party libraries
const colors = require('colors')
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const graphqlHTTP = require('express-graphql')
// 1st party libraries
const schema = require('./server/schema')
const auth = require('./server/auth')()
const api = require('./server/api')()
const MovieQueue = require('./server/lib/MovieQueue')

// Load mongoose models
require('./server/models')(mongoose)
let { Movie } = mongoose.models
// Load libraries
const omdb = require('./server/lib/omdb')(process.env.OMDB_API_KEY)
const queue = new MovieQueue({ listID: 'TimeUpMovieQueue' })
const app = express()

// Setup expressjs middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: 'pudding-sama',
    // store:  new RedisStore({
    //     host: REDIS_HOST,
    //     port: REDIS_PORT
    // }),
    proxy: true,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    req.omdb = omdb;
    req.movieQueue = queue;
    next();
})

queue.initQueuePolling(async (error, imdbID) => {
    // Check if movie exists
    let movieCount = await Movie.countDocuments({ imdbID })
    if( 0 < movieCount ) {
        return
    }
    // Create movie in database
    let omdbMovie = await omdb.get(imdbID)
    let movie = new Movie(omdbMovie)
    movie.save()
    // Add move runtime string
    queue.client.sadd('TimeUpRunTimes', omdbMovie.Runtime)
})


app.use('/', express.static(path.join(__dirname, 'app/')));
app.use('/auth', auth.router)
app.use('/api', api.router)

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));


// Setup basic endpoints
app.all('*', (req, res) => {
    if (process.env.ENVIRONMENT == 'prod') {
        return res.sendFile(`${__dirname}/app/index.html`);
    } else {
        res.redirect(process.env.NG_SERVER)
    }
});


// Start server
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true }).then(() => {
    console.log('DataBase connection established! 😎')
    app.listen(process.env.PORT, () => {
        console.log(`[Listening]`.green, `URI: `, `http://localhost:${process.env.PORT}`.cyan)
    })
})