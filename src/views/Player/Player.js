import React, { useContext, useEffect, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import tokenContext from "../../tokenContext";
import axios from "axios";
import { navigate } from "@reach/router";

import { turnLightOnOrOff, changeBrightness  } from "../../hueControl";

export default function Player(props) {


    var token = useContext(tokenContext);

    if (!token[0]?.access_token) {
        navigate("/")
    }

    var [content, setContent] = useState();
    var [progress, setProgress] = useState();
    var [length, setLength] = useState();

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    // setLength(millisToMinutesAndSeconds(content?.item.duration_ms));
    console.log(content?.item.duration_ms);
    length = millisToMinutesAndSeconds(content?.item.duration_ms);
    console.log(length);

    useEffect(function() {
        axios.get("https://api.spotify.com/v1/me/player/currently-playing?market=DK", {
            headers: {
                "Authorization": "Bearer " + token[0].access_token
            }
        })
        .then(response => {
            setContent(response.data);
            console.log(content);
        });
    }, [token, setContent])


    return (
        <div className="player">
            {/* <ButtonGroup variant="contained" color="primary">
                <Button onClick={() => {turnLightOnOrOff(false)}}>Turn off</Button>
                <Button onClick={() => {turnLightOnOrOff(true)}}>Turn on</Button>
            </ButtonGroup>

            <Slider 
                style={{margin: "0 40px"}}
                onChange={changeBrightness}
                // orientation="vertical"
                defaultValue={0}
                min={1}
                max={254}
            />

            <ButtonGroup color="primary">
                <Button onClick={() => {turnLightOnOrOff(true, 0, 0)}}>White</Button>
                <Button onClick={() => {turnLightOnOrOff(true, 254, 0)}}>Red</Button>
                <Button onClick={() => {turnLightOnOrOff(true, 254, 15000)}}>Green</Button>
            </ButtonGroup> */}
            <h1>{content?.item.name}</h1>
            <img src={content?.item.album.images[0].url} alt="album art" />
            <Slider 
                style={{width: "400px"}}
                defaultValue={progress}
                min={1}
                max={content?.item.duration_ms / 1000}
            />
            <p>{(content?.item.duration_ms / 1000).toFixed(0)}</p>
            <p>{length}</p>
            <p>{progress}</p>
        </div>
    )
}
