

module.exports = (mongoose) => {
	const Schema = mongoose.Schema;

	var schema = new Schema({
        imdbID: String,
        Title: String,
        Year: String,
        Rated: String,
        Released: String,
        Runtime: String,
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
        date_created: { 
			type: Date, 
			default: Date.now 
        },
    });

	return mongoose.model('ScreenPlay', schema);
}





