const { GraphQLSchema, GraphQLObjectType } = require('graphql')

const ScreenPlay = require('./queries/ScreenPlay')
const ScreenPlays = require('./queries/ScreenPlays')

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Rootquery',
        fields: () => ({
            ...ScreenPlay,
            ...ScreenPlays,
        })
    })
});
