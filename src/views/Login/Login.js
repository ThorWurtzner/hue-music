import React from 'react';
import querystring from "querystring";

export default function Login(props) {
    
    var queryParameters = querystring.stringify({
        response_type: "code",
        client_id: process.env.REACT_APP_CLIENT_ID,
        scope: "user-read-currently-playing user-read-playback-state",
        redirect_uri: "http://localhost:8888/callback",
        state: "kasdalskdjalksjdalksd"
    });

    return (
        <div className="login">
            <a href={`https://accounts.spotify.com/authorize?${queryParameters}`}>Login to Spotify</a>
        </div>
    )
}
