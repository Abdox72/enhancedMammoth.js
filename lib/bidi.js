exports.readParagraphRightToLeft = readParagraphRightToLeft;
exports.readRunRightToLeft = readRunRightToLeft;
exports.alignmentToCss = alignmentToCss;
exports.paragraphAttributes = paragraphAttributes;
exports.runDirectionAttributes = runDirectionAttributes;

function readParagraphRightToLeft(element) {
    return readOnOffElement(element.first("w:bidi"));
}

function readRunRightToLeft(element) {
    var rtlElement = element.first("w:rtl");
    if (!rtlElement) {
        return null;
    }
    return readOnOffElement(rtlElement);
}

function readOnOffElement(element) {
    if (!element) {
        return false;
    }
    var value = element.attributes["w:val"];
    return value !== "false" && value !== "0";
}

function alignmentToCss(alignment, isRightToLeft) {
    if (!alignment) {
        return null;
    }

    switch (alignment) {
    case "center":
        return "center";
    case "left":
        return "left";
    case "right":
        return "right";
    case "both":
    case "distribute":
    case "justify":
        return "justify";
    case "start":
        return isRightToLeft ? "right" : "left";
    case "end":
        return isRightToLeft ? "left" : "right";
    default:
        return null;
    }
}

function paragraphAttributes(paragraph) {
    var attrs = {};

    if (paragraph.isRightToLeft) {
        attrs.dir = "rtl";
    }

    var textAlign = alignmentToCss(paragraph.alignment, paragraph.isRightToLeft);
    if (textAlign) {
        attrs.style = "text-align:" + textAlign;
    }

    return attrs;
}

function runDirectionAttributes(run, paragraphRightToLeft) {
    if (run.rightToLeft === true) {
        return {dir: "rtl"};
    }
    if (run.rightToLeft === false && paragraphRightToLeft) {
        return {dir: "ltr"};
    }
    return null;
}
