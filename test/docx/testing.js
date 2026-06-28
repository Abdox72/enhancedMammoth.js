var createBodyReader = require("../../lib/docx/body-reader").createBodyReader;
var defaultNumbering = require("../../lib/docx/numbering-xml").defaultNumbering;
var Styles = require("../../lib/docx/styles-reader").Styles;
var defaultTheme = require("../../lib/docx/theme-reader").defaultTheme;

function createBodyReaderForTests(options) {
    options = Object.create(options || {});
    options.styles = options.styles || new Styles({}, {});
    options.theme = options.theme || defaultTheme;
    options.numbering = options.numbering || defaultNumbering;
    return createBodyReader(options);
}

exports.createBodyReaderForTests = createBodyReaderForTests;
