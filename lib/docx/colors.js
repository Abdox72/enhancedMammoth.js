exports.readColor = readColor;
exports.readShading = readShading;
exports.readUnderline = readUnderline;
exports.highlightToCss = highlightToCss;
exports.normalizeHexColor = normalizeHexColor;

var HIGHLIGHT_COLORS = {
    black: "#000000",
    blue: "#0000FF",
    cyan: "#00FFFF",
    green: "#00FF00",
    magenta: "#FF00FF",
    red: "#FF0000",
    yellow: "#FFFF00",
    white: "#FFFFFF",
    darkBlue: "#000080",
    darkCyan: "#008080",
    darkGreen: "#008000",
    darkMagenta: "#800080",
    darkRed: "#800000",
    darkYellow: "#808000",
    darkGray: "#808080",
    lightGray: "#C0C0C0"
};

function highlightToCss(highlight) {
    if (!highlight) {
        return null;
    }
    if (HIGHLIGHT_COLORS[highlight]) {
        return HIGHLIGHT_COLORS[highlight];
    }
    return normalizeHexColor(highlight);
}

function normalizeHexColor(value) {
    if (!value || value === "auto") {
        return null;
    }
    if (value.charAt(0) === "#") {
        value = value.substring(1);
    }
    if (/^[0-9A-Fa-f]{6}$/.test(value)) {
        return "#" + value.toUpperCase();
    }
    if (/^[0-9A-Fa-f]{8}$/.test(value)) {
        return "#" + value.substring(2).toUpperCase();
    }
    return null;
}

function readColor(element, theme) {
    var colorElement = element.first("w:color");
    if (!colorElement) {
        return null;
    }
    return readColorAttributes(colorElement.attributes, theme);
}

function readShading(element, theme) {
    var shd = element.first("w:shd");
    if (!shd) {
        return null;
    }
    var attrs = shd.attributes;
    var fill = attrs["w:fill"];
    if (!fill || fill === "auto") {
        return null;
    }
    return resolveColorValue(fill, attrs, theme);
}

function readColorAttributes(attributes, theme) {
    var themeColor = attributes["w:themeColor"];
    var value = attributes["w:val"];

    if (themeColor && theme) {
        var themeValue = theme.getColor(themeColor);
        if (themeValue) {
            return applyThemeModifiers(themeValue, attributes);
        }
    }

    if (value) {
        return resolveColorValue(value, attributes, theme);
    }

    return null;
}

function resolveColorValue(value, attributes, theme) {
    if (!value || value === "auto") {
        return null;
    }
    var color = normalizeHexColor(value);
    if (color && (attributes["w:themeTint"] || attributes["w:themeShade"])) {
        return applyThemeModifiers(color, attributes);
    }
    return color;
}

function applyThemeModifiers(color, attributes) {
    var rgb = hexToRgb(color);
    if (!rgb) {
        return color;
    }

    var tint = attributes["w:themeTint"];
    var shade = attributes["w:themeShade"];

    if (tint !== undefined) {
        rgb = applyTint(rgb, parseInt(tint, 16));
    }
    if (shade !== undefined) {
        rgb = applyShade(rgb, parseInt(shade, 16));
    }

    return rgbToHex(rgb);
}

function applyTint(rgb, tint) {
    var factor = tint / 255;
    return {
        r: Math.round(rgb.r * factor + 255 * (1 - factor)),
        g: Math.round(rgb.g * factor + 255 * (1 - factor)),
        b: Math.round(rgb.b * factor + 255 * (1 - factor))
    };
}

function applyShade(rgb, shade) {
    var factor = shade / 255;
    return {
        r: Math.round(rgb.r * factor),
        g: Math.round(rgb.g * factor),
        b: Math.round(rgb.b * factor)
    };
}

function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 8) {
        hex = hex.substring(2);
    }
    if (hex.length !== 6) {
        return null;
    }
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };
}

function rgbToHex(rgb) {
    function component(value) {
        var string = value.toString(16);
        return string.length === 1 ? "0" + string : string;
    }
    return "#" + (component(rgb.r) + component(rgb.g) + component(rgb.b)).toUpperCase();
}

function readUnderline(element, theme) {
    if (!element) {
        return {isUnderline: false, style: null, color: null};
    }
    var value = element.attributes["w:val"];
    var isUnderline = value !== undefined && value !== "false" && value !== "0" && value !== "none";
    if (!isUnderline) {
        return {isUnderline: false, style: null, color: null};
    }
    var style = value === "single" || value === undefined ? null : value;
    var colorValue = element.attributes["w:color"];
    var color = colorValue ? resolveColorValue(colorValue, element.attributes, theme) : null;
    return {isUnderline: true, style: style, color: color};
}
