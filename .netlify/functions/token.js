const { default: axios } = require("axios");

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "" }

    var body = JSON.parse(event.body);

    var authOptions = {
        url: "https://accounts.spotify.com/api/token",
        method: "post",
        params: {
            code: body.code,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: "authorization_code"
        },
        headers: {
            "Authorization": "Basic " + (Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64"))
        }
    }

    try {
        var response = await axios(authOptions)

        return {
            statusCode: 201,
            body: JSON.stringify(response.data)
        }
    } catch(error) {
        console.log(error);
        return {
            statusCode: 500,
            body: "internal server error"
        }
    }

}