const fs = require('fs')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const { resolve } = require('path')

var graphqlSchemaString = fs.readFileSync(resolve(__dirname, './index.graphql')).toString();
const schema = buildSchema(graphqlSchemaString)


// Load graphql functions
const root = ({ mongoose: { models: { ScreenPlay }}, omdb, queue }) => {

    return {
        screenplay: async ({ id }) => {
            let screenplay = await ScreenPlay.findOne({ imdbID: id });
            if( screenplay != null ) {
                return screenplay
            }
            let omdbScreenPlay = await omdb.get(id)
            screenplay = new ScreenPlay(omdbScreenPlay)
            return screenplay.save();
        },
        search: async ({ searchTerm }) => {
            let { Search } = await omdb.search(searchTerm)
            queue.pushScreenPlays(Search)
            return Search
        }
    }
}

module.exports = (options) => {
    return graphqlHTTP({
        schema: schema,
        rootValue: root(options),
        graphiql: true
    })
}