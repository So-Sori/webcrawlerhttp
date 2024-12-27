const {normalizeURL,getUrlsFromHTML} = require('./crawler.js');
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

test('getUrlsFromHTML',() => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href = "http://fullstackopen.com/">
                FulstackOpen
            </a>
        </body>
    </html>
    `;
    const inputBasedUrl = "";
    const actual = getUrlsFromHTML(inputHTMLBody,inputBasedUrl);
    const expected = ["http://fullstackopen.com/"];

    expect(actual).toEqual(expected);
})

test('getUrlsFromHTML relative',() => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href = "/en/about">
                FulstackOpen
            </a>
        </body>
    </html>
    `;
    const inputBasedUrl = "https://fullstackopen.com";
    const actual = getUrlsFromHTML(inputHTMLBody,inputBasedUrl);
    const expected = ["https://fullstackopen.com/en/about"];

    expect(actual).toEqual(expected);
})

test('getUrlsFromHTML many',() => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href = "/en/about">
                FulstackOpen one
            </a>
            <a href = "/en/#course-contents">
                FulstackOpen two
            </a>
        </body>
    </html>
    `;
    const inputBasedUrl = "https://fullstackopen.com";
    const actual = getUrlsFromHTML(inputHTMLBody,inputBasedUrl);
    const expected = ["https://fullstackopen.com/en/about","https://fullstackopen.com/en/#course-contents"];

    expect(actual).toEqual(expected);
})

test('getUrlsFromHTML invalid',() => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href = "invalid">
                FulstackOpen two
            </a>
        </body>
    </html>
    `;
    const inputBasedUrl = "https://fullstackopen.com";
    const actual = getUrlsFromHTML(inputHTMLBody,inputBasedUrl);
    const expected = [];

    expect(actual).toEqual(expected);
})