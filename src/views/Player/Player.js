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
    var [start, setStart] = useState(false);

    var [beat1, setBeat1] = useState();
    var [beat2, setBeat2] = useState();
    
    if (content) {
        length = millisToMinutesAndSeconds(content?.item.duration_ms);
    }
    
    // Turn on light and get song on load
    useEffect(() => {
        if (!token[0]?.access_token) {
            changeBrightness(null, 0);
            console.log("No token present");
            navigate("/")
        }
        turnLightOnOrOff(true);
        fetchSong(token[0]?.access_token)
            .then(response => {
                setContent(response.data);
                console.log(content);
                if (response?.data?.is_playing === false || !content) {
                    clearInterval(beat1);
                    clearInterval(beat2);
                }
                // setProgress(millisToMinutesAndSeconds(response.data.progress_ms));
            });
    }, [])
    
    // Update Content every second
    useEffect(function() {
        console.log(content?.is_playing);
        if (token[0]?.access_token) {
            setInterval(() => {
                fetchSong(token[0]?.access_token)
                .then(response => {
                    setContent(response.data);
                    setProgress(millisToMinutesAndSeconds(response.data.progress_ms));
                    // if (response.data.is_playing === false) {
                    //     turnLightOnOrOff(false);
                    //     clearInterval(beat1);
                    //     clearInterval(beat2);
                    // }
                })
            }, 1000)
        }
    }, [])

    useEffect(() => {
        if (content?.is_playing === false || !content) {
            clearInterval(beat1);
            clearInterval(beat2);
            setStart(false);
        }
        if (content?.is_playing === true) {
            setStart(true);
        }
    }, [content])
    
    // Get Track Analysis
    useEffect(() => {
        if (content) {
            songAnalysis(token[0]?.access_token, content.item.id)
            .then(response => {
                setTempo(response?.data.track.tempo)
                console.log(response?.data);
            })
        }
    }, [content?.item?.id])

    
    useEffect(() => {
        if (tempo) {
            const period = 60 / tempo * 2;
            // setInterval(() => {
            //     changeBrightness(null, 40)
            // }, period * 1000);
    
            // setInterval(() => {
            //     changeBrightness(null, 60)
            // }, (period * 1000) * 2);
            

            // EVERY TIME COMPONENT RERENDERS ANOTHER INSTANCE IS CREATED, FIX IT
            // REMOVE INTERVALS BEFORE SETTING NEW
            // clearInterval(beat1);
            // clearInterval(beat2);

            clearInterval(beat1)
            clearInterval(beat2)

            if (token[0]?.access_token) {
                setBeat1(setInterval(() => {
                    setBg(0.6);
                    changeBrightness(null, 40);
                    // console.log("Beat1");
                }, period * 1000))
        
                setBeat2(setInterval(() => {
                    setBg(1)
                    changeBrightness(null, 70);
                    // console.log("Beat2");
                }, (period * 1000) * 2))
            }
    
        }
    }, [tempo, content?.is_playing])
    
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
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 30px", borderRadius: "20px", marginBottom: "10px"}}>
                        <h3 style={{color: "#eee", fontSize: "20px", fontWeight: "lighter", fontFamily: "Hino Micho", marginBottom: "10px", textShadow: "1px 1px 4px #000"}}>{content?.item.artists[0].name}</h3>
                        <h1 style={{color: "#eee", fontSize: "30px", fontWeight: "normal", fontFamily: "Hino Micho", textShadow: "1px 1px 4px #000"}}>{content?.item.name}</h1>
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
                    <div style={{display: "flex", alignItems: "center", marginTop: "10px", backgroundColor: "#000", padding: "10px 17px", borderRadius: "10px", width: "500px"}}>
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
