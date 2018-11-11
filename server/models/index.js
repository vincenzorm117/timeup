

module.exports = (mongoose) => {
    return {
        ScreenPlay: require('./ScreenPlay')(mongoose)
    }
}