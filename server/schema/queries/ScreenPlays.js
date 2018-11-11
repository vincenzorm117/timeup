const { GraphQLNonNull, GraphQLString, GraphQLList }  = require('graphql')
const { ScreenPlay } = require('../types/ScreenPlay')


module.exports = {
    movies: {
        type: new GraphQLList(ScreenPlay),
        description: "Get a list of movies",
        args: {
            id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve:  (parent, {id}) => {
            // return fakeDatabase.getBlogPost(id);
        }
    }
}