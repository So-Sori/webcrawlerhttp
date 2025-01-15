import { crawlingPage } from "./shoppingCrawler.js";
import { shoopingLinksCard } from "./shoopingLinksCard.js";

async function shoopingZone() {
  let productsOpt = document.getElementById("products-opt").value;
  let containerProducsCard = document.getElementById("products-container");
  let linkPages = [];
  let setOfUrls = new Set();
  if (
    productsOpt === "clothes" ||
    productsOpt === "shoes" ||
    productsOpt === "electronics"
  ) {
    linkPages = await crawlingPage(
      `https://www.amazon.com/s?k=${productsOpt}&rh=p_n_deal_type%3A23566065011%2Cp_8%3A50-`,
      `https://www.amazon.com/s?k=${productsOpt}&rh=p_n_deal_type%3A23566065011%2Cp_8%3A50-`,
      setOfUrls,
      0
    );
  } else {
    linkPages = await crawlingPage(
      `https://www.amazon.com/s?rh=p_n_deal_type%3A23566065011%2Cp_8%3A50-`,
      `https://www.amazon.com/s?rh=p_n_deal_type%3A23566065011%2Cp_8%3A50-`,
      setOfUrls,
      0
    );
  }

  for (const linkPage of linkPages) {
    containerProducsCard.innerHTML += await shoopingLinksCard(linkPage);
  }
}

let productsOpt = document.getElementById("products-opt");

productsOpt.addEventListener("change", () => {
  shoopingZone();
});
