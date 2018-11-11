const { GraphQLNonNull, GraphQLString, GraphQLList }  = require('graphql')
const { Movie } = require('../types/Movie')


module.exports = {
    movies: {
        type: new GraphQLList(Movie),
        description: "Get a list of movies",
        args: {
            id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve:  (parent, {id}) => {
            // return fakeDatabase.getBlogPost(id);
        }
    }
}