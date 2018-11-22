

export interface ScreenPlay {
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
    RuntimeMinutes: number,
    date_created: Date
}

export const ScreenPlayEqual = (a: ScreenPlay, b: ScreenPlay) => {
    try {
        return a.imdbID == b.imdbID;
    } catch(_) {
        return false;
    }
}