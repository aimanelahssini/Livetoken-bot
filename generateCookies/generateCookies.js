const puppeteer = require('puppeteer')
const fs = require('fs').promises;

(async () => {

    const browser = await puppeteer.launch({headless: false});
    // Create page once browser loads
let [page] = await browser.pages();

// Turn on page request interception
await page.setRequestInterception(true);

// Add event listener on request
page.on('request', async (req) => {

    // If the request url is what I want, start my function
    if (req.url() === 'https://youtube.com/?authuser=0') {
        await getCookies(page);
        await browser.close();
    }

    // If the url is not, continue normal functionality of the page
    req.continue();
});

// Then go to my url once all the listeners are setup
await page.goto('https://accounts.google.com/AccountChooser?service=wise&continue=https://youtube.com')
  })()

