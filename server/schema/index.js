const fs = require('fs')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const { resolve } = require('path')

var graphqlSchemaString = fs.readFileSync(resolve(__dirname, './index.graphql')).toString();
const schema = buildSchema(graphqlSchemaString)


// Load graphql functions
const root = ({ ScreenPlay }) => {
    return {
        screenplay: async ({ id }) => {
            return ScreenPlay.findOne({ imdbID: id })
        },
        search: async ({ searchTerm }) => {
            let regex = new RegExp(searchTerm, "i")
            if (searchTerm !== '') return ScreenPlay.find({ Title: regex })
            else return ScreenPlay.find()
        }
    }
}

module.exports = (mongoose) => {
    return graphqlHTTP({
        schema: schema,
        rootValue: root(mongoose.models),
        graphiql: true
    })
}