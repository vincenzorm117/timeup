const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLInputObjectType, GraphQLNonNull } = require('graphql')


module.exports = {
    ScreenPlay: new GraphQLObjectType({
        name: "ScreenPlay",
        description: "All details of a ScreenPlay",
        fields: {
            imdbID: { type: GraphQLString },
            Title: { type: GraphQLString },
            Year: { type: GraphQLString },
            Rated: { type: GraphQLString },
            Released: { type: GraphQLString },
            Runtime: { type: GraphQLString },
            Genre: { type: GraphQLString },
            Director: { type: GraphQLString },
            Writer: { type: GraphQLString },
            Actors: { type: GraphQLString },
            Plot: { type: GraphQLString },
            Language: { type: GraphQLString },
            Country: { type: GraphQLString },
            Awards: { type: GraphQLString },
            Poster: { type: GraphQLString },
            Metascore: { type: GraphQLString },
            imdbRating: { type: GraphQLString },
            imdbVotes: { type: GraphQLString },
            Type: { type: GraphQLString },
            totalSeasons: { type: GraphQLString },
            Response: { type: GraphQLString },
        }
    }),
    ScreenPlayInputType: new GraphQLInputObjectType({
        name: 'ScreenPlayInput',
        fields: {
            imdbID: { type: GraphQLString }, 
            Title: { type: GraphQLString },
        }
    })
}
