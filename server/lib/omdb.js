
const { HttpGet } = require('./common');
const { isEmpty, isString, isInteger, isPlainObject } = require('lodash')

module.exports = (apiKey) => {
    if( !(/[a-z0-9]{8}/i).test(apiKey) ) {
        throw new Error('Invalid OMDB API key.')
    }

    const dataBaseURL = `http://www.omdbapi.com/?apikey=${apiKey}`
    const posterBaseURL = `http://img.omdbapi.com/?apikey=${apiKey}`

    const types = ['movie','series','episode']
    const plotTypes = ['short','full']

    const CreateUrl = (term, termType, { type, year, page, plot } = {}) => {
        if( !isString(term) || isEmpty(term) ) {
            throw new Error('Invalid term. First argument, term, must be a non empty string.')
        }
        if( termType != 1 && termType != 0 ) {
            throw new Error('Invalid type. Second argument, type, must be 1 or 0.')
        }
        let typeSymbol = termType == 0 ? 's' : (/^tt.*$/.test(term) ? 'i' : 't');
        term = encodeURIComponent(term)

        let url = `${dataBaseURL}&${typeSymbol}=${term}`

        if( type == 0 ) {
            if( 0 <= types.indexOf(type) ) {
                url += `&type=${type}`
            }
    
            if( isInteger(page) && 0 < page ) {
                url += `&page=${page}`
            }
        } else {
            if( 0 <= plotTypes.indexOf(plot) ) {
                url += `&plot=${plot}`
            }
        }

        if( isInteger(year) && 1850 < year ) {
            url += `&y=${year}`
        }

        return url
    }

    const search = (term, options = {}) => {
        // Build URL
        let url = CreateUrl(term, 0, options)
        // Return http response
        return HttpGet(url)
    }

    const get = (term, options = {}) => {
        // Build URL
        let url = CreateUrl(term, 1, options)
        // Return http response
        return HttpGet(url)
    }

    return { search, get }
}