exports.readThemeXml = readThemeXml;
exports.defaultTheme = Theme.EMPTY;

var wordToSchemeName = {
    dark1: "dk1",
    light1: "lt1",
    dark2: "dk2",
    light2: "lt2",
    accent1: "accent1",
    accent2: "accent2",
    accent3: "accent3",
    accent4: "accent4",
    accent5: "accent5",
    accent6: "accent6",
    hyperlink: "hlink",
    followedHyperlink: "folHlink"
};

function Theme(colors) {
    return {
        getColor: function(name) {
            return colors[name] || null;
        }
    };
}

Theme.EMPTY = new Theme({});

function readThemeXml(root) {
    var colors = {};
    var clrScheme = root
        .firstOrEmpty("a:themeElements")
        .firstOrEmpty("a:clrScheme");

    Object.keys(wordToSchemeName).forEach(function(wordName) {
        var schemeName = wordToSchemeName[wordName];
        var element = clrScheme.first("a:" + schemeName);
        if (element) {
            colors[wordName] = readColorFromSchemeElement(element);
        }
    });

    return new Theme(colors);
}

function readColorFromSchemeElement(element) {
    var srgb = element.first("a:srgbClr");
    if (srgb) {
        var val = srgb.attributes["val"];
        return val ? "#" + val.toUpperCase() : null;
    }
    var sys = element.first("a:sysClr");
    if (sys) {
        var lastClr = sys.attributes["lastClr"];
        return lastClr ? "#" + lastClr.toUpperCase() : null;
    }
    return null;
}
