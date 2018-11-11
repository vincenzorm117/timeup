const { GraphQLNonNull, GraphQLString }  = require('graphql')
const { ScreenPlay } = require('../types/ScreenPlay')


module.exports = {
    movie: {
        type: ScreenPlay,
        description: "Get details of a single screenplay",
        args: {
            id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve:  (parent, {id}) => {


            // return fakeDatabase.getBlogPost(id);
        }
    }
}