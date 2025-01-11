export function linksCardCreator(pages) {
    let htmlCards = ''
    for (const page of Object.entries(pages)) {
        htmlCards += `
            <div>
                <p>Link: ${page[0]}</p>
            </div>
        `
    }
    return htmlCards;
}