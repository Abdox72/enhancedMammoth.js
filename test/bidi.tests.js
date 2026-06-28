var assert = require("assert");

var bidi = require("../lib/bidi");
var test = require("./test")(module);

test("alignment start resolves to right in rtl paragraphs", function() {
    assert.equal(bidi.alignmentToCss("start", true), "right");
});

test("alignment start resolves to left in ltr paragraphs", function() {
    assert.equal(bidi.alignmentToCss("start", false), "left");
});

test("alignment end resolves to left in rtl paragraphs", function() {
    assert.equal(bidi.alignmentToCss("end", true), "left");
});

test("paragraphAttributes includes dir for rtl paragraphs", function() {
    assert.deepEqual(bidi.paragraphAttributes({
        isRightToLeft: true,
        alignment: null
    }), {
        dir: "rtl"
    });
});

test("paragraphAttributes includes text-align when alignment is set", function() {
    assert.deepEqual(bidi.paragraphAttributes({
        isRightToLeft: true,
        alignment: "center"
    }), {
        dir: "rtl",
        style: "text-align:center"
    });
});

test("runDirectionAttributes returns rtl for rtl runs", function() {
    assert.deepEqual(bidi.runDirectionAttributes({rightToLeft: true}, false), {
        dir: "rtl"
    });
});

test("runDirectionAttributes returns ltr for explicit ltr runs in rtl paragraphs", function() {
    assert.deepEqual(bidi.runDirectionAttributes({rightToLeft: false}, true), {
        dir: "ltr"
    });
});

test("runDirectionAttributes returns null when direction is inherited", function() {
    assert.equal(bidi.runDirectionAttributes({rightToLeft: null}, true), null);
});
