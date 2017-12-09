const pinyin = require("pinyin");

// Translate a string of hanzi 
// @return the pinyin as string
function translate(text, options = {}) {
  const default_config = {
    heteronym: true,              // Enable heteronym mode.
    segment: true                 // Enable Chinese words segmentation, fix most heteronym problem.
  };
  const config = Object.assign(default_config, options);
  // slowest but most accurate
  const translation = pinyin(text, config);
  if (Array.isArray(translation) && translation.length > 0) {
    console.log("got pinyin array", translation);
    return _flatten(translation).join(' ');
  } else {
    console.log("pinyin ERROR", translation);
    return '';
  }
}

// strip double quotes
function cleanText(text) {
  return text.replace(/['"]+/g, '')
}


// ==== PRIVATE =====

// Flatten a nested array by joining the first elements
function _flatten(arr) {
  return arr.reduce((acc, cur) => cur[0] ? acc.concat(cur[0]) : acc, []);
}

module.exports = {
    translate: translate,
    cleanText: cleanText,
};
