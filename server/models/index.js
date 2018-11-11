

module.exports = function(mongoose) {

    return {
        Movie: require('./Movie')(mongoose)
    }
}





