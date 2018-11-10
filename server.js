require('dotenv').config()

const colors = require('colors')
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
// const graphqlHTTP = require('express-graphql')
// const schema = require('./server/schema')
const auth = require('./server/auth')()

const app = express()

// Setup expressjs middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    name:   'pudding-sama',
    // store:  new RedisStore({
    //     host: REDIS_HOST,
    //     port: REDIS_PORT
    // }),
    proxy:  true,
    resave: false,
    saveUninitialized: true
}));


app.use('/', express.static(path.join(__dirname, 'app/')));
app.use('/auth', auth.router)

// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     graphiql: true
//   }));


// Setup basic endpoints
app.all('*', (req, res) => {
    if( process.env.ENVIRONMENT == 'prod' ) {
        return res.sendFile(`${ __dirname}/app/index.html`);
    } else {
        res.redirect(process.env.NG_SERVER)
    }
});


// Start server
mongoose.connect(process.env.MONGO_DB).then(() => {
    console.log('DataBase connection established! 😎')
    app.listen(process.env.PORT, () => {
        console.log(`[Listening]`.green,`URI: `, `http://localhost:${process.env.PORT}`.cyan)
    })
})