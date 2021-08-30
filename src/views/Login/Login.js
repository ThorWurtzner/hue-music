import React, { useEffect, useState } from 'react';
import querystring from "querystring";
import { navigate } from "@reach/router";
import "./Login.css";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function Login(props) {

    var [ls, setLs] = useState(false);
    
    var queryParameters = querystring.stringify({
        response_type: "code",
        client_id: process.env.REACT_APP_CLIENT_ID,
        scope: "user-read-currently-playing user-read-playback-state",
        redirect_uri: "http://localhost:8888/callback",
        state: "kasdalskdjalksjdalksd"
    });
    

    function handleSubmit(event) {
        event.preventDefault();
        alert("Registered");
        setLs(true);
    }

    // navigate(`https://accounts.spotify.com/authorize?${queryParameters}`);

    return (
        <div className="login">
            {ls === true ? 
            <a href={`https://accounts.spotify.com/authorize?${queryParameters}`}>Login to Spotify</a>
            :
            <form className="login__form" onSubmit={event => handleSubmit(event)}>
                <div>
                    <TextField 
                        id="standard-basic" 
                        label="Hue ID" 
                    />
                </div>
                <div>
                    <TextField 
                        id="standard-basic" 
                        label="IP Address" 
                    />
                </div>
                <div>
                    <TextField 
                        id="standard-basic"
                        label="Username" 
                    />
                </div>
                <Button variant="contained" color="primary" type="submit">Register</Button>
            </form>}
        </div>
    )
}
