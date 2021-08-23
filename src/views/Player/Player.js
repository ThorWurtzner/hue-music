import React, { useContext, useEffect, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import tokenContext from "../../tokenContext";
import axios from "axios";
import { navigate } from "@reach/router";

import { turnLightOnOrOff, changeBrightness, changeColor } from "../../hueControl";

import ColorThief from "colorthief";
import { createRef } from 'react';

export default function Player() {

    var imgRef = createRef();

    var token = useContext(tokenContext);

    // if (!token[0]?.access_token) {
    //     navigate("/")
    // }

    var [content, setContent] = useState();
    var [progress, setProgress] = useState();
    var [length, setLength] = useState();
    var [hexColor, setHexColor] = useState();
    var [hueColor, setHueColor] = useState();
    var [timer, setTimer] = useState();

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')

    if (content) {
        length = millisToMinutesAndSeconds(content?.item.duration_ms);
    }

    function EnhanceColor(normalized) {
        if (normalized > 0.04045) {
            return Math.pow( (normalized + 0.055) / (1.0 + 0.055), 2.4);
        }
        else { return normalized / 12.92; }
            
    }
    
    function RGBtoXY(r, g, b) {
        let rNorm = r / 255.0;
        let gNorm = g / 255.0;
        let bNorm = b / 255.0;
    
        let rFinal = EnhanceColor(rNorm);
        let gFinal = EnhanceColor(gNorm);
        let bFinal = EnhanceColor(bNorm);
    
        let X = rFinal * 0.649926 + gFinal * 0.103455 + bFinal * 0.197109;
        let Y = rFinal * 0.234327 + gFinal * 0.743075 + bFinal * 0.022598;
        let Z = rFinal * 0.000000 + gFinal * 0.053077 + bFinal * 1.035763;
    
        if ( X + Y + Z === 0) {
            return [0,0];
        } else {
            let xFinal = X / (X + Y + Z);
            let yFinal = Y / (X + Y + Z);
        
            return [xFinal, yFinal];
        }
    
    };

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
    }, [token, setContent, timer])

    return (
        <div className="player" style={{backgroundColor: hexColor, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <Button variant="contained" style={{marginTop: "20px"}} onClick={() => setTimer(Math.random())}>Update</Button>
            <ButtonGroup variant="contained" style={{marginTop: "20px"}}>
                <Button onClick={() => {turnLightOnOrOff(false)}}>Turn off</Button>
                <Button onClick={() => {turnLightOnOrOff(true)}}>Turn on</Button>
            </ButtonGroup>

            <ButtonGroup variant="contained" style={{margin: "10px 0"}}>
                <Button onClick={() => {turnLightOnOrOff(true, 0, 0)}}>White</Button>
                <Button onClick={() => {turnLightOnOrOff(true, 254, 0)}}>Red</Button>
                <Button onClick={() => {turnLightOnOrOff(true, 254, 15000)}}>Green</Button>
            </ButtonGroup>
            {content ?
                <> 
                    <h3 style={{color: "#fff", fontSize: "33px" }}>{content?.item.artists[0].name}</h3>
                    <h1 style={{color: "#fff", fontSize: "60px", marginBottom: "30px"}}>{content?.item.name}</h1>
                    <img
                        style={{width: "500px"}}
                        crossOrigin={"anonymous"}
                        ref={imgRef}
                        src={content?.item.album.images[0].url}
                        alt={"example"}
                        className={"example__img"}
                        onLoad={() => {
                            const colorThief = new ColorThief();
                            const img = imgRef.current;
                            const result = colorThief.getColor(img, 25);
                            // console.log(result);
                            var hexColor = rgbToHex(result[0], result[1], result[2]);
                            // console.log(hexColor);
                            setHexColor(hexColor);
                            var hueColor = RGBtoXY(result[0], result[1], result[2]);
                            setHueColor(hueColor);
                            console.log(hueColor);
                            changeColor(hueColor[0], hueColor[1]);
                        }}
                    />
                    <Slider
                        style={{width: "400px"}}
                        defaultValue={progress}
                        min={1}
                        max={content?.item.duration_ms / 1000}
                        track
                        disabled
                    />
                    <p style={{color: "#fff"}}>{(content?.item.duration_ms / 1000).toFixed(0)}</p>
                    <p style={{color: "#fff"}}>{length}</p>
                    {/* <p>{progress}</p> */}
                    {/* <div style={{width: "200px", height: "200px", backgroundColor: hexColor}}></div> */}
                </> 
                :
                <p style={{color: "#fff"}}>No song is currently playing</p>}
        </div>
    )
}
