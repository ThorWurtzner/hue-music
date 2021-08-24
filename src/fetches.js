const axios = require("axios");

function fetchSong(token) {
    return axios.get("https://api.spotify.com/v1/me/player/currently-playing?market=DK", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}

function songAnalysis(token, id) {
    return axios.get(`https://api.spotify.com/v1/audio-analysis/${id}`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}

export { fetchSong, songAnalysis };