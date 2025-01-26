export async function crawlingPage(baseURL, currentPageUrl, pages, depth) {
  const maxDepth = 1;
  const maxSetLimit = 100;
  const baseURLObject = new URL(baseURL);
  const currentPageUrlObject = new URL(currentPageUrl);

  if (baseURLObject.hostname != currentPageUrlObject.hostname) {
    return pages;
  }

  const normalizeCurrentUrl = normalizeURL(currentPageUrl);
  if (pages.has(normalizeCurrentUrl) || pages.size >= maxSetLimit) {
    return pages;
  } else {
    pages.add(normalizeCurrentUrl);
  }

  try {
    const userAgents = [
      // Chrome (Windows)
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",

      // Chrome (Mac)
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",

      // Firefox (Windows)
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",

      // Firefox (Linux)
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0",
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",

      // Safari (Mac)
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",

      // Safari (iPhone)
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",

      // Chrome (Android)
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",

      // Firefox (Android)
      "Mozilla/5.0 (Android 13; Mobile; rv:122.0) Gecko/122.0 Firefox/122.0",

      // Microsoft Edge (Windows)
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Edge/121.0.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Edge/120.0.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",

      // Opera
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 OPR/91.0.0.0",
    ];

    function getRandomUserAgent() {
      return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    let randomUserAgent = getRandomUserAgent();
    let resp = await fetch(`http://localhost:3000/proxy/${currentPageUrl}`, {
      method: "GET",
      headers: {
        "User-Agent": randomUserAgent,
      },
    });

    let newUserAgentDelay = 1000;
    while (resp.status === 503 && newUserAgentDelay <= 5000) {
      await delay(newUserAgentDelay);
      randomUserAgent = getRandomUserAgent();
      resp = await fetch(`http://localhost:3000/proxy/${currentPageUrl}`, {
        method: "GET",
        headers: {
          "User-Agent": randomUserAgent,
        },
      });
      newUserAgentDelay += 500;
    }

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
      if (depth > maxDepth || pages.size >= maxSetLimit) {
        return pages;
      } else {
        await crawlingPage(baseURL, nextUrl, pages, depth + 1);
        pages.add(normalizeURL(nextUrl));
      }
    }
  } catch (err) {
    return err;
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
  return new Promise((resolve) => setTimeout(resolve, ms));
}
