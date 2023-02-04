function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.substring(1)
}

function simplifyYoutubeUrl(string) {
    return string.replace('https://www.youtube.com/watch?v=', 'https://youtu.be/')
}

module.exports = {
    capitalizeFirstLetter,
    simplifyYoutubeUrl,
}