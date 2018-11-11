
const redis = require('redis')
const { isInteger } = require('lodash')

class MovieQueue {

    constructor({ port, host, cb, time } = {}) {
        this.client = redis.createClient()
        this.listID = 'MovieQueue';
        this.time = isInteger(time) || time < 0 ? (time) : 2000;
        this.mode = true;
    }

    pushMovies(movies) {
        movies = movies.map(movie => movie.imdbID)
        this.client.rpush(this.listID, ...movies)
        this.mode = true;
    }

    initQueuePolling(cb) {
        setInterval(() => {
            if( this.mode == false ) return;
            this.client.llen(this.listID, (error, size) => {
                if( error ) throw new Error(error)
                if( 0 < size ) {
                    this.client.lpop(this.listID, cb)
                } else {
                    this.mode = false
                }
            })
        }, this.time)
    }
}


module.exports = MovieQueue;