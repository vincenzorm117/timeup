

module.exports = (mongoose) => {
    const Schema = mongoose.Schema;

    var schema = new Schema({
        imdbID: String,
        Title: String,
        Year: String,
        Rated: String,
        Released: String,
        Genre: String,
        Director: String,
        Writer: String,
        Actors: String,
        Plot: String,
        Language: String,
        Country: String,
        Awards: String,
        Poster: String,
        Metascore: String,
        imdbRating: String,
        imdbVotes: String,
        Type: String,
        totalSeasons: String,
        Response: String,
        Runtime: String,
        RuntimeMinutes: Number,
        date_created: {
            type: Date,
            default: Date.now
        },
    });

    schema.pre('save', function (next) {
        let runtime = 0
        let matches = this.Runtime.match(/(\d+)\s*min/i)
        if (Array.isArray(matches) || matches.length == 2) {
            runtime = parseInt(matches[1])
            if (isNaN(runtime)) {
                runtime = 0
            }
        }
        this.RuntimeMinutes = runtime
        // do stuff
        next();
    });

    return mongoose.model('ScreenPlay', schema);
}





