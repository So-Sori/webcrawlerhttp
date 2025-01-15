export async function shoopingLinksCard(currentPageUrl) {
  let cardProducs = "";
  let resp = await fetch(currentPageUrl);

  if (resp.status > 399) {
    return `Error in fetch status code: ${resp.status}, on page ${currentPageUrl}`;
  }
  const contentType = resp.headers.get("content-type");
  if (!contentType.includes("text/html")) {
    return `non html response: ${contentType}, on page ${currentPageUrl}`;
  }

  let HTMLBody = await resp.text();
  const dom = new DOMParser().parseFromString(HTMLBody, "text/html");
  const img = dom.window.document.querySelector("imgTagWrapper");
  const title = dom.window.document.getElementById("title");
  const dolarSing = dom.window.document.querySelector("a-price-symbol");
  const price = dom.window.document.querySelector("a-price-whole");

  cardProducs.innerHtml = `
        <div class = "card-product">
        ${img}
        ${title}
        ${dolarSing}${price}
        </div>
    `;

  return cardProducs;
}
