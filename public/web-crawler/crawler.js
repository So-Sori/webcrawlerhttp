import { crawlingPage } from "../js/globalCrawler.js";
import { linksCardCreator } from "./linksCardCreator.js";

const btnSendForm = document.getElementById("send-link-btn");

async function generalCrawler() {
  let searchValue = document.getElementById("search-bar").value;
  let messageStatus = document.getElementById("status-request");
  let text = "";
  const linksContainer = document.getElementById("link-container");

  let baseURL = null;
  try {
    
    if (searchValue.slice(0, 1) === "/") {
        throw new Error("No valid website provided, please provide a valid url to search.");
    }
    else if (searchValue === "") {
        text = "No website provided, please provide a url to search.";
    } else {
        new URL(searchValue);
        baseURL = searchValue;
        console.log(`Starting crawling in: ${baseURL}`);
        text = `Searching for urls on the page: ${baseURL}`;
    }
  } catch (err) {
    text = "No valid website provided, please provide a valid url to search.";
  }

  messageStatus.innerText = text;

  const pages = await crawlingPage(baseURL, baseURL, {});
  linksContainer.innerHTML = linksCardCreator(pages);
}

btnSendForm.addEventListener("click", () => {
  generalCrawler();
});
