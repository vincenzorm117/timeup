const { GraphQLSchema, GraphQLObjectType } = require('graphql')

const movie = require('./queries/movie')
const movies = require('./queries/movies')

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Rootquery',
        fields: () => ({
            ...movie,
            ...movies,
        })
    })
});
