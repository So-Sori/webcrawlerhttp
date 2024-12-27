const {JSDOM} = require('jsdom');

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
    getUrlsFromHTML
}