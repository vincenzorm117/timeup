const { GraphQLNonNull, GraphQLString, GraphQLList }  = require('graphql')
const { ScreenPlay } = require('../types/screenplay')


module.exports = {
    screenplays: {
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