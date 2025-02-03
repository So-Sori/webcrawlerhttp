export async function shoopingLinksCard(arrPages, containerProducsCard) {
  // console.log(containerProducsCard);
  // console.log(containerProducsCard.innerHTML);
  
  for (const linkPage of arrPages) {
    if (!(arrPages.indexOf(linkPage) === 0)) {
      try {
        let resp = await fetch(`http://localhost:3000/proxy/${linkPage}`);

        if (resp.status > 399) {
          throw new Error(`Error in fetch status code: ${resp.status}`);
        }
        const contentType = resp.headers.get("content-type");
        if (!contentType.includes("text/html")) {
          throw new Error(`non html response: ${contentType}, on page ${linkPage}`);
        }

        let HTMLBody = await resp.text();
        const dom = new DOMParser().parseFromString(HTMLBody, "text/html");
        const img = dom.querySelector(".a-dynamic-image");
        const title = dom.getElementById("title");
        const dolarSing = dom.querySelector(".a-price-symbol");
        const price = dom.querySelector(".a-price-whole");
        // const savingPercent = dom.querySelector("._cDEzb_apex-savings-percent_nsC2Z");
        const savingPercent = dom.querySelectorAll('span[class]')
        const classNames = Array.from(savingPercent).map(span => span.className);
        const discount = classNames.filter((c) => c.includes('apex-savings-percent'))
        
        const realPrice = dom.querySelector(".a-offscreen");
        const parseLink = 'https://' + linkPage;
        
        containerProducsCard.innerHTML += `
        <div class="card-product">
            <div>
              ${img.outerHTML ? img.outerHTML : "not found"}
            </div>
    
            <div>
              ${title.innerHTML ? title.innerHTML : "not found"}
            </div>
            <div>
              Saving: ${discount.innerHTML ? discount.innerHTML : "not found"}
            </div>
            <div>
              Price: ${dolarSing.innerHTML ? dolarSing.innerHTML : "not found"}${price.innerHTML ? price.innerHTML : "not found"}
            </div>
            <div>
              Recomended price: ${realPrice.innerHTML ? realPrice.innerHTML : "not found"}
            </div>
            <a href="${parseLink ? parseLink : "#"}" target="_blank">Product on Amazon</a>
  
        </div>
          `;
        }catch (err) { 
          throw new Error(`Element not found : ${err}`);
        }
      } 
  }
  return containerProducsCard;
}
