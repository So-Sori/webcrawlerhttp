function normalizeURL(URLstring){
    let urlObjec = new URL(URLstring);
    const hostName = `${urlObjec.hostname}${urlObjec.pathname}`;
    if (hostName.length > 0 && hostName.slice(-1) === '/'){
        return hostName.slice(0,-1);
    }
    return hostName;
}
module.exports = {normalizeURL};