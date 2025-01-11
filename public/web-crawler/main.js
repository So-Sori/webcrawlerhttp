import {crawlingPage} from "./crawler.js"
import {linksCardCreator} from "./linksCardCreator.js"

const btnSendForm = document.getElementById("send-link-btn");

async function main() {
    let searchValue = document.getElementById("search-bar").value;
    let listOfLinks = searchValue.split(" ");
    let messageStatus = document.getElementById("status-request");
    let text = "";
    const linksContainer = document.getElementById('link-container');
    
    if (listOfLinks.length === 0 ) {
        text = "No website provided, please provide a link to search."
        messageStatus.innerText = text;
    }

    if (listOfLinks.length > 1) {
        text = "Too many websites provided, please provide just one link to search."
        messageStatus.innerText = text;
    }

    const baseURL = listOfLinks[0];

    console.log(`Starting crawling in: ${baseURL}`);
    text = `Searching for links on the page: ${baseURL}`
    messageStatus.innerText = text;

    const pages = await crawlingPage(baseURL,baseURL,{});
    linksContainer.innerHTML = linksCardCreator(pages);
}

btnSendForm.addEventListener('click', () =>{
    main();
})