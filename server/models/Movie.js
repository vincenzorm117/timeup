

module.exports = function(mongoose) {
	const Schema = mongoose.Schema;

	var schema = new Schema({
        imdbID: { type: String },
        Title: { type: String },
        Year: { type: String },
        Rated: { type: String },
        Released: { type: String },
        Runtime: { type: String },
        Genre: { type: String },
        Director: { type: String },
        Writer: { type: String },
        Actors: { type: String },
        Plot: { type: String },
        Language: { type: String },
        Country: { type: String },
        Awards: { type: String },
        Poster: { type: String },
        Metascore: { type: String },
        imdbRating: { type: String },
        imdbVotes: { type: String },
        Type: { type: String },
        totalSeasons: { type: String },
        Response: { type: String },
        date_created: { 
			type: Date, 
			default: Date.now 
        },
    });
    

	return mongoose.model('Movie', schema);
}





