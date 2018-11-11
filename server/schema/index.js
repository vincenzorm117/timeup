const { GraphQLSchema, GraphQLObjectType } = require('graphql')

const screenplay = require('./queries/screenplay')
const screenplays = require('./queries/screenplays')

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Rootquery',
        fields: () => ({
            ...screenplay,
            ...screenplays,
        })
    })
});
