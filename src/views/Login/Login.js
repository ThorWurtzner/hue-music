import React, { useEffect, useState } from 'react';
import querystring from "querystring";
import { navigate } from "@reach/router";
import "./Login.css";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { changeBrightness } from "../../hueControl";

export default function Login(props) {
    
    var queryParameters = querystring.stringify({
        response_type: "code",
        client_id: process.env.REACT_APP_CLIENT_ID,
        scope: "user-read-currently-playing user-read-playback-state",
        redirect_uri: process.env.NODE_ENV === "production" ? "https://hue-music.netlify.app/callback" : "http://localhost:8888/callback",
        state: "kasdalskdjalksjdalksd"
    });

    changeBrightness(null, 0);

    function handleSubmit(event) {
        event.preventDefault();
        window.localStorage.setItem("id", event.target.id.value)
        window.localStorage.setItem("ip", event.target.ip.value)
        window.localStorage.setItem("username", event.target.username.value)
        navigate(`https://accounts.spotify.com/authorize?${queryParameters}`);
    }


    return (
        <div className="login">
            {
            window.localStorage.getItem("id") && window.localStorage.getItem("ip") && window.localStorage.getItem("username")
            ? 
            <div className="login__ready">
                {/* <p>Lamp is registered</p> */}
                <img src="/penguin.png" alt="penguin" />
                <a href={`https://accounts.spotify.com/authorize?${queryParameters}`}>Login to Spotify</a>
            </div>
            :
            <form className="login__form" onSubmit={event => handleSubmit(event)}>
                <div>
                    <TextField
                        name="id"
                        id="standard-basic" 
                        label="Hue ID"
                        required
                    />
                </div>
                <div>
                    <TextField 
                        name="ip"
                        id="standard-basic" 
                        label="IP Address" 
                        required
                    />
                </div>
                <div>
                    <TextField 
                        name="username"
                        id="standard-basic"
                        label="Username" 
                        required
                    />
                </div>
                <Button variant="contained" color="primary" type="submit">Register</Button>
            </form>
            }
        </div>
    )
}
