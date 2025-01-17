export async function crawlingPage(baseURL, currentPageUrl, pages) {
  const baseURLObject = new URL(baseURL);
  const currentPageUrlObject = new URL(currentPageUrl);

  if (baseURLObject.hostname != currentPageUrlObject.hostname) {
    return pages;
  }

  const normalizeCurrentUrl = normalizeURL(currentPageUrl);
  if (pages[normalizeCurrentUrl] > 0) {
    pages[normalizeCurrentUrl]++;
    return pages;
  }

  pages[normalizeCurrentUrl] = 1;

  try {
    const resp = await fetch(`http://localhost:3000/proxy/${currentPageUrl}`, {
      method: "GET",
    });
    if (resp.status > 399) {
      console.log(
        `Error in fetch status code: ${resp.status}, on page ${currentPageUrl}`
      );
      return pages;
    }
    const contentType = resp.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(
        `non html response: ${contentType}, on page ${currentPageUrl}`
      );
      return pages;
    }

    const htmlBody = await resp.text();
    const nextUrls = getUrlsFromHTML(htmlBody, baseURLObject.hostname);

    for (const nextUrl of nextUrls) {
      pages = await crawlingPage(baseURL, nextUrl, pages);
    }
  } catch (err) {
    console.log(`Error in fetch: ${err.message}, on page ${currentPageUrl}`);
  }
  return pages;
}

function getUrlsFromHTML(HTMLBody, baseURL) {
  const urls = [];
  const dom = new DOMParser().parseFromString(HTMLBody, "text/html");
  const linkElements = dom.querySelectorAll("a");

  for (const linkElement of linkElements) {
    try {
      let hrefJustPath = linkElement.href.split("http://localhost:3000")[1];
      const urlObject = new URL(`https://${baseURL}${hrefJustPath}`);
      urls.push(urlObject.href);
    } catch (err) {
      console.log("error invalid url: ", err.message);
    }
  }
  return urls;
}

function normalizeURL(URLstring) {
  let urlObject = new URL(URLstring);
  const hostName = `${urlObject.hostname}${urlObject.pathname}`;
  if (hostName.length > 0 && hostName.slice(-1) === "/") {
    return hostName.slice(0, -1);
  }
  return hostName;
}
