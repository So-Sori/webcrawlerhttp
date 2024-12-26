const {normalizeURL} = require('./crawler.js');
const {test,expect} = require('@jest/globals');

test('normalizeURL erase protocol',() => {
    const input = "https://fullstackopen.com";
    const actual = normalizeURL(input);
    const expected = "fullstackopen.com";

    expect(actual).toEqual(expected);
})

test('normalizeURL erase slash at the end',() => {
    const input = "https://fullstackopen.com/path/";
    const actual = normalizeURL(input);
    const expected = "fullstackopen.com/path";

    expect(actual).toEqual(expected);
})

test('normalizeURL capitals',() => {
    const input = "https://fullstackOPEN.com/path/";
    const actual = normalizeURL(input);
    const expected = "fullstackopen.com/path";

    expect(actual).toEqual(expected);
})

test('normalizeURL erase protocol',() => {
    const input = "http://fullstackopen.com";
    const actual = normalizeURL(input);
    const expected = "fullstackopen.com";

    expect(actual).toEqual(expected);
})