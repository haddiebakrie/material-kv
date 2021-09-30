"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbaToHex = void 0;
function rgbaToHex(rgba) {
    var rhex = rgba[0].toString().length === 1 ? rgba[0] = "0" + rgba[0] : rgba[0].toString(16);
    var ghex = rgba[1].toString().length === 1 ? rgba[1] = "0" + rgba[1] : rgba[1].toString(16);
    var bhex = rgba[2].toString().length === 1 ? rgba[2] = "0" + rgba[2] : rgba[2].toString(16);
    var ahex = rgba[3].toString().length === 1 ? rgba[3] = "0" + rgba[3] : rgba[3].toString(16);
    var hexValue = "#" + rhex + ghex + bhex + ahex;
    return [hexValue];
}
exports.rgbaToHex = rgbaToHex;
//# sourceMappingURL=rgba-to-hex.js.map