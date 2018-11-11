const { GraphQLNonNull, GraphQLString }  = require('graphql')
const { ScreenPlay } = require('../types/screenplay')


module.exports = {
    screenplay: {
        type: ScreenPlay,
        description: "Get details of a single screenplay",
        args: {
            id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve:  (parent, {id}) => {
            debugger

            return {
                Title: 'Funnyman'
            }
            // return fakeDatabase.getBlogPost(id);
        }
    }
}