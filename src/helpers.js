
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')


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

export { millisToMinutesAndSeconds, rgbToHex, EnhanceColor, RGBtoXY };