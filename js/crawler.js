const {JSDOM} = require('jsdom');

async function crawlingPage(baseURL,currentPageUrl,pages) {

    const baseURLObject = new URL(baseURL);
    const currentPageUrlObject = new URL(currentPageUrl);

    if (baseURLObject.hostname != currentPageUrlObject.hostname ) {
        return pages;
    }

    const normalizeCurrentUrl = normalizeURL(currentPageUrl);
    if (pages[normalizeCurrentUrl] > 0) {
        pages[normalizeCurrentUrl]++;
        return pages;
    }

    pages[normalizeCurrentUrl] = 1;    

    try{
        const resp = await fetch(currentPageUrl);
        if (resp.status > 399) {
            console.log(`Error in fetch status code: ${resp.status}, on page ${currentPageUrl}`);
            return pages;
        }
        
        const contentType = resp.headers.get("content-type");
        if (!contentType.includes('text/html')) {
            console.log(`non html response: ${contentType}, on page ${currentPageUrl}`);
            return pages;
        }

        const htmlBody = await resp.text();
        const nextUrls = getUrlsFromHTML(htmlBody,baseURL);

        for(const nextUrl of nextUrls){
            pages = await crawlingPage(baseURL,nextUrl,pages);
        }
    }catch(err){
        console.log(`Error in fetch: ${err.message}, on page ${currentPageUrl}`);
    }

    return pages;
}

function getUrlsFromHTML(HTMLBody, baseURL){
    const urls = [];
    const dom = new JSDOM(HTMLBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    for(const linkElement of linkElements){
        if (linkElement.href.slice(0,1) === "/") {
            //relative
            try{
                const urlObjec = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObjec.href);
            }catch(err){
                console.log("error invalid url: ",err.message); 
            }

        } else {
            //absolute
            try{
                const urlObjec = new URL(`${linkElement.href}`);
                urls.push(urlObjec.href);
            }catch(err){
                console.log("error invalid url: ",err.message); 
            }
        }
    }
    return urls;
}

function normalizeURL(URLstring){
    let urlObjec = new URL(URLstring);
    const hostName = `${urlObjec.hostname}${urlObjec.pathname}`;
    if (hostName.length > 0 && hostName.slice(-1) === '/'){
        return hostName.slice(0,-1);
    }
    return hostName;
}
module.exports = {
    normalizeURL,
    getUrlsFromHTML,
    crawlingPage
}