// Converting NSColor to Hex
const msToRGB = (v) => {
	return (Math.round(v * 255))
}

const componentArray = (hexValue, r, g, b) => {
	hexValue.push(msToRGB(r));
    hexValue.push(msToRGB(g));
    hexValue.push(msToRGB(b));
    return hexValue;
}

export const rgbToHex = (arr, r, g, b, a) => {
	const hexValue = arr;
	componentArray(hexValue, r, g, b);

	function hex(x) {
		return (`0${parseInt(x).toString(16)}`).slice(-2);
	}

	const color = `#${hex(hexValue[0])}${hex(hexValue[1])}${hex(hexValue[2])}`;
	const opacity = a;

	if (opacity < 1) {
		console.log(`${color}, opacity: ${opacity}`);
	} else {
		console.log(color);
	}

	return color;
}
