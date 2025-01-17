export async function shoopingLinksCard(currentPageUrl) {  
  let cardProducs = document.createElement("div");
  cardProducs.className = "card-product";
  let resp = await fetch(`http://localhost:3000/proxy/${currentPageUrl}`);

  if (resp.status > 399) {
    return `Error in fetch status code: ${resp.status}, on page ${currentPageUrl}`;
  }
  const contentType = resp.headers.get("content-type");
  if (!contentType.includes("text/html")) {
    return `non html response: ${contentType}, on page ${currentPageUrl}`;
  }
  
  let HTMLBody = await resp.text();
  const dom = new DOMParser().parseFromString(HTMLBody, "text/html");
  const img = dom.querySelector("#main-image");
  const title = dom.getElementById("title");
  const dolarSing = dom.querySelector(".a-price-symbol");
  const price = dom.querySelector(".a-price-whole");
    
  cardProducs.innerHTML = `
        ${img.outerHTML}
        ${title.innerHTML}
        ${dolarSing.innerHTML}${price.innerHTML}
    `;
  return cardProducs;
}
