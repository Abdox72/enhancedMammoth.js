var colors = require("./docx/colors");

exports.buildRunInlineStyle = buildRunInlineStyle;
exports.underlineStyleToCss = underlineStyleToCss;
exports.escapeCssFontFamily = escapeCssFontFamily;

function buildRunInlineStyle(run, options) {
    options = options || {};
    var parts = [];

    if (run.font) {
        parts.push("font-family:" + escapeCssFontFamily(run.font));
    }
    if (run.fontSize) {
        parts.push("font-size:" + run.fontSize + "pt");
    }
    if (run.color && !options.hasColorStyleMap) {
        parts.push("color:" + run.color);
    }
    if (run.backgroundColor && !options.hasShadingStyleMap) {
        parts.push("background-color:" + run.backgroundColor);
    }
    if (run.highlight !== null && !options.hasHighlightStyleMap && !run.backgroundColor) {
        var highlightCss = colors.highlightToCss(run.highlight);
        if (highlightCss) {
            parts.push("background-color:" + highlightCss);
        }
    }
    if (run.isUnderline && (run.underlineStyle || run.underlineColor)) {
        parts.push(underlineStyleToCss(run.underlineStyle));
        if (run.underlineColor) {
            parts.push("text-decoration-color:" + run.underlineColor);
        }
    }

    return parts.length > 0 ? parts.join(";") : null;
}

function underlineStyleToCss(style) {
    switch (style) {
    case "double":
        return "text-decoration:underline;text-decoration-style:double";
    case "dotted":
        return "text-decoration:underline;text-decoration-style:dotted";
    case "dash":
    case "dotDash":
    case "dotDotDash":
        return "text-decoration:underline;text-decoration-style:dashed";
    case "wave":
        return "text-decoration:underline;text-decoration-style:wavy";
    case "thick":
        return "text-decoration:underline;text-decoration-thickness:2px";
    default:
        return "text-decoration:underline";
    }
}

function escapeCssFontFamily(value) {
    if (/[^a-zA-Z0-9\-]/.test(value)) {
        return '"' + value.replace(/"/g, "\\\"") + '"';
    }
    return value;
}
