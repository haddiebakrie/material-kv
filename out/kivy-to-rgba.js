"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToRGBA = void 0;
function convertToRGBA(colorValue) {
    const ccolor = colorValue[0];
    var colorList = JSON.parse(ccolor);
    var redValue = (colorList[0] <= 1) ? Math.round(colorList[0] * 255) : 255;
    var greenValue = (colorList[1] <= 1) ? Math.round(colorList[1] * 255) : 255;
    var blueValue = (colorList[2] <= 1) ? Math.round(colorList[2] * 255) : 255;
    var alphaValue = (colorList[3] <= 1) ? Math.round(colorList[3] * 255) : 255;
    return [redValue, greenValue, blueValue, alphaValue];
}
exports.convertToRGBA = convertToRGBA;
//# sourceMappingURL=kivy-to-rgba.js.map