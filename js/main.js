const {crawlingPage} = require('./crawler.js');

async function main() {
    
    if (process.argv.length < 3) {
        console.log("No website provided");
        process.exit(1);
    }

    if (process.argv.length > 3) {
        console.log("Too website provide");
        process.exit(1);
    }

    const baseURL = process.argv[2];

    console.log(`Starting crawling in: ${baseURL}`);
    const pages = await crawlingPage(baseURL,baseURL,{});

    for (const page of Object.entries(pages)) {
        console.log(page);
    }
}

main();