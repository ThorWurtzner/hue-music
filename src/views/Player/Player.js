import React from 'react';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { turnLightOnOrOff, changeBrightness  } from "../../hueControl";

export default function Player(props) {

    return (
        <div className="player">
            <ButtonGroup variant="contained" color="primary">
                <Button onClick={() => {turnLightOnOrOff(false)}}>Turn off</Button>
                <Button onClick={() => {turnLightOnOrOff(true)}}>Turn on</Button>
            </ButtonGroup>

            <Slider 
                style={{margin: "0 40px"}}
                onChange={changeBrightness}
                orientation="vertical"
                defaultValue={0}
                min={1}
                max={254}
            />

            <ButtonGroup color="primary">
                <Button onClick={() => {turnLightOnOrOff(true, 0, 0)}}>White</Button>
                <Button onClick={() => {turnLightOnOrOff(true, 254, 0)}}>Red</Button>
                <Button onClick={() => {turnLightOnOrOff(true, 254, 15000)}}>Green</Button>
            </ButtonGroup>
        </div>
    )
}
