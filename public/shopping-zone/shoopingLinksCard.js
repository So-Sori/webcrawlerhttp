export async function shoopingLinksCard(arrPages, containerProducsCard) {
  for (const linkPage of arrPages) {
    if (!(arrPages.indexOf(linkPage) === 0)) {
      let resp = await fetch(`http://localhost:3000/proxy/${linkPage}`);

      if (resp.status > 399) {
        return `Error in fetch status code: ${resp.status}, on page ${linkPage}`;
      }
      const contentType = resp.headers.get("content-type");
      if (!contentType.includes("text/html")) {
        return `non html response: ${contentType}, on page ${linkPage}`;
      }

      let HTMLBody = await resp.text();
      const dom = new DOMParser().parseFromString(HTMLBody, "text/html");
      const img = dom.querySelector("#main-image");
      const title = dom.getElementById("title");
      const dolarSing = dom.querySelector(".a-price-symbol");
      const price = dom.querySelector(".a-price-whole");

      containerProducsCard.innerHTML += `
      <div class="card-product">
        ${img.outerHTML}
        ${title.innerHTML}
        ${dolarSing.innerHTML}${price.innerHTML}
      </div>
        `;
    }
  }
  return containerProducsCard;
}
