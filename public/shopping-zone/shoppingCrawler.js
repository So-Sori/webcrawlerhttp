export async function crawlingPage(baseURL, currentPageUrl, pages, depth) {
  const maxDepth = 1;
  const baseURLObject = new URL(baseURL);
  const currentPageUrlObject = new URL(currentPageUrl);

  if (baseURLObject.hostname != currentPageUrlObject.hostname) {
    return pages;
  }

  const normalizeCurrentUrl = normalizeURL(currentPageUrl);
  if (pages.has(normalizeCurrentUrl)) {
    return pages;
  } else {
    pages.add(normalizeCurrentUrl);
  }

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
    const nextUrls = getUrlsFromHTML(htmlBody, baseURLObject.hostname, depth);

    for (const nextUrl of nextUrls) {

      if (depth > maxDepth && pages.size >= 60) {
        return pages;
      } else {
        await delay(5000);
        await crawlingPage(baseURL, nextUrl, pages, depth + 1);
        pages.add(normalizeURL(nextUrl));
      }
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

      let regex = /\/(dp|gp\/product)\/[A-Z0-9]+(?:\?.*?discount=\d+)??/;
      if (regex.test(urlObject.href)) {
        urls.push(urlObject.href);
      }
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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
