var assert = require("assert");

var colors = require("../../lib/docx/colors");
var themeReader = require("../../lib/docx/theme-reader");
var xml = require("../../lib/xml");
var XmlElement = xml.Element;
var test = require("../test")(module);

test("normalizeHexColor converts six digit hex", function() {
    assert.equal(colors.normalizeHexColor("ff0000"), "#FF0000");
});

test("normalizeHexColor ignores auto", function() {
    assert.equal(colors.normalizeHexColor("auto"), null);
});

test("highlightToCss maps named highlight colors", function() {
    assert.equal(colors.highlightToCss("yellow"), "#FFFF00");
});

test("readColor applies theme tint", function() {
    var element = new XmlElement("w:rPr", {}, [
        new XmlElement("w:color", {
            "w:val": "4472C4",
            "w:themeTint": "BF"
        })
    ]);
    assert.equal(colors.readColor(element, null), "#7395D3");
});

test("readThemeXml reads accent colors", function() {
    var themeXml = new XmlElement("a:theme", {}, [
        new XmlElement("a:themeElements", {}, [
            new XmlElement("a:clrScheme", {}, [
                new XmlElement("a:accent1", {}, [
                    new XmlElement("a:srgbClr", {"val": "4472C4"})
                ])
            ])
        ])
    ]);
    var theme = themeReader.readThemeXml(themeXml);
    assert.equal(theme.getColor("accent1"), "#4472C4");
});
