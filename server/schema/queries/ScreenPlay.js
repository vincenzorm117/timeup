const { GraphQLNonNull, GraphQLString }  = require('graphql')
const { Movie } = require('../types/ScreenPlay')


module.exports = {
    movie: {
        type: Movie,
        description: "Get details of a single screenplay",
        args: {
            id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve:  (parent, {id}) => {


            // return fakeDatabase.getBlogPost(id);
        }
    }
}