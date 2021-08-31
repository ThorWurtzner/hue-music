import axios from "axios";

var IP_ADDRESS = window.localStorage.getItem("ip"); // 192.168.8.100
var HUE_ID = window.localStorage.getItem("id"); // 18
var USERNAME = window.localStorage.getItem("username"); // 0TM4TMVWbNkdKeZncMxBP3k-o2U3IgbFiPPuKoSn

const turnLightOnOrOff = async (on, sat, hue) => {
    try {
        return await axios.put(`http://${IP_ADDRESS}/api/${USERNAME}/lights/${HUE_ID}/state`, {
            on: on,
            sat: sat ? sat : 0,
            hue: hue ? hue : 0,
        });
    } catch (err) {
        console.error(err);
    }
};

async function changeBrightness (event, newValue) {
    try {
        return await axios.put(`http://${IP_ADDRESS}/api/${USERNAME}/lights/${HUE_ID}/state`, {
            bri: newValue,
            transitiontime: 1,
        });
    } catch (err) {
        console.error(err);
    }
}

async function changeColor (x, y) {
    try {
        return await axios.put(`http://${IP_ADDRESS}/api/${USERNAME}/lights/${HUE_ID}/state`, {
            xy: [
                x,
                y
            ],
            transitiontime: 1,
        });
    } catch (err) {
        console.error(err);
    }
}

export { turnLightOnOrOff, changeBrightness, changeColor };