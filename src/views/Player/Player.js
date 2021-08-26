import React, { useContext, useEffect, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import tokenContext from "../../tokenContext";
import axios from "axios";
import { navigate } from "@reach/router";
import { fetchSong, songAnalysis } from "../../fetches";

import { turnLightOnOrOff, changeBrightness, changeColor } from "../../hueControl";
import { millisToMinutesAndSeconds, rgbToHex, EnhanceColor, RGBtoXY } from "../../helpers";

import ColorThief from "colorthief";
import { createRef } from 'react';

export default function Player() {

    var imgRef = createRef();
    var token = useContext(tokenContext);
    
    var [content, setContent] = useState();
    var [progress, setProgress] = useState();
    var [length, setLength] = useState();
    var [hexColor, setHexColor] = useState();
    var [hueColor, setHueColor] = useState();
    var [tempo, setTempo] = useState();
    var [bg, setBg] = useState();
    
    if (content) {
        length = millisToMinutesAndSeconds(content?.item.duration_ms);
    }
    
    // Turn on light and get song on load
    useEffect(() => {
        turnLightOnOrOff(true);
        fetchSong(token[0]?.access_token)
            .then(response => {
                setContent(response.data);
                // setProgress(millisToMinutesAndSeconds(response.data.progress_ms));
            })
    }, [])
    
    // Update Content every second
    useEffect(function() {
        setInterval(() => {
            fetchSong(token[0]?.access_token)
            .then(response => {
                setContent(response.data);
                setProgress(millisToMinutesAndSeconds(response.data.progress_ms));
                console.log(content);
            }); 
        }, 1000)
    }, [token])
    
    // Get Track Analysis
    useEffect(() => {
        if (content) {
            songAnalysis(token[0]?.access_token, content.item.id)
            .then(response => {
                setTempo(response?.data.track.tempo)
            })
        }
    }, [content?.item?.id])

    
    // useEffect(() => {
    //     if (tempo) {
    //         const period = 60 / tempo * 2;
    //         // setInterval(() => {
    //         //     changeBrightness(null, 40)
    //         // }, period * 1000);
    
    //         // setInterval(() => {
    //         //     changeBrightness(null, 60)
    //         // }, (period * 1000) * 2);
    
    //         setInterval(() => {
    //             // setBg(0.6)
    //             console.log("Beat");
    //         }, period * 1000)
    
    //         setInterval(() => {
    //             // setBg(1)
    //         }, (period * 1000) * 2)
    //     }
    // }, [tempo])
    
    // console.log(tempo);
                                
    return (
        <div className="player" style={{backgroundColor: hexColor, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            {/* <ButtonGroup variant="contained" style={{marginTop: "20px"}}>
                <Button onClick={() => {turnLightOnOrOff(false)}}>Turn off</Button>
                <Button onClick={() => {
                    turnLightOnOrOff(true);
                    changeColor(hueColor[0], hueColor[1]);
                }}>Turn on</Button>
                </ButtonGroup>
                
                <Slider
                style={{width: "200px"}}
                onChangeCommitted={changeBrightness}
                min={1}
                max={254}
            /> */}

            {/* <ButtonGroup variant="contained" style={{margin: "10px 0"}}>
                <Button onClick={() => {turnLightOnOrOff(true, 0, 0)}}>White</Button>
                <Button onClick={() => {turnLightOnOrOff(true, 254, 0)}}>Red</Button>
                <Button onClick={() => {turnLightOnOrOff(true, 254, 15000)}}>Green</Button>
            </ButtonGroup> */}
            
            {content ?
                <> 
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "10px 30px", borderRadius: "20px 20px 0 0"}}>
                        <h3 style={{color: "#eee", fontSize: "24px", fontWeight: "lighter", fontFamily: "Hino Micho"}}>{content?.item.artists[0].name}</h3>
                        <h1 style={{color: "#eee", fontSize: "40px", fontWeight: "normal", fontFamily: "Hino Micho"}}>{content?.item.name}</h1>
                    </div>
                    <img
                        style={{width: "500px", border: "4px solid black", opacity: bg}}
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
                            // console.log(hueColor);
                            changeColor(hueColor[0], hueColor[1]);
                        }}
                    />
                    <div style={{display: "flex", alignItems: "center", marginTop: "10px", backgroundColor: "#000", padding: "10px 17px", borderRadius: "10px"}}>
                        <p style={{color: "#eee"}}>{progress}</p>
                        <Slider
                            key={`slider-${content.progress_ms / 1000}`} /* fixed issue */
                            style={{width: "400px", margin: "0 25px"}}
                            defaultValue={content.progress_ms / 1000}
                            min={1}
                            max={content?.item.duration_ms / 1000}
                            track
                            disabled
                        />
                        <p style={{color: "#eee"}}>{length}</p>
                    </div>
                </> 
                :
                <>
                    <p style={{color: "#000", fontSize: "24px"}}>No song is currently playing</p>
                    <img src="./penguin.png" alt="penguin" style={{width: "200px", marginTop: "30px"}} />
                </>
            }
        </div>
    )
}
