/* The goal is to be able to run this on a RPi with a fiber connection */

/* 
SPEED ENHANCEMENT
 1. Disable images
 2. Disable CSS
 3. Set headless to true
https://www.scrapehero.com/how-to-increase-web-scraping-speed-using-puppeteer/ 
https://stackoverflow.com/questions/48773031/how-to-prevent-chrome-headless-from-loading-images

*/

/* 
AVOID BOT DETECTION
 1. Use a (random) user agent (https://github.com/skratchdot/random-useragent)
      Use the same one time, it'll look sketchy if there are multiple user agents on one IP
 2. Enable images
 3. Accept-Language ("en,en-US;q=0,5")
 4. Accept ("text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8")
 5. Use a random timeout where timeouts are used
 6. Headless to false unless you use the Accept-Language case-sensitive (https://news.ycombinator.com/item?id=20479015)
 7. Setting up cookies and local storage data (https://scrapingant.com/blog/puppeteer-tricks-to-avoid-detection-and-make-web-scraping-easier)
 8. Use stealth plugin (https://www.npmjs.com/package/puppeteer-extra-plugin-stealth)

*/

// Run Puppeteer with Minimal settings
const puppeteer = require('puppeteer');

const minimal_args = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-infobars',
  '--window-position=0,0',
  '--ignore-certifcate-errors',
  '--ignore-certifcate-errors-spki-list',
  '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"' //modification needed

];

const browser = await puppeteer.launch({
  headless: true,
  args: minimal_args
})

async function initBrowser() {
  const browser = await puppeteer.launch({headless: false, args: minimal_args});
  const page = (await browser.pages())[0]; //avoid using newPage, opening a new Chromium tab could lead to bot detection
  await page.goto('https://livetoken.co/deals/live');
  return page;
  //await browser.close()
}

/*
//setup flames to 3 and droplets to 3
async function setupOptions(){

}
*/


//click on Buy
//class btn buyButton btn-success btn-sm

async function goToTS(){
  //2 seconds to setup the flames and droplets
  //await page.waitForTimeout(2000)
  await page.click("button[class='btn buyButton btn-success btn-sm']", elem => elem.click());
  // !NOTE! Be aware of the tab opening
  const tsPage = await page.evaluate("() => window.location.href")

}

//double click the purchase button
async function purchaseOnTS(){
  await tsPage.click("button[class='ButtonBase__StyledButton-sc-1qgxh2e-0 gjCpfL Button__StyledButton-ig3kkl-1 yOxki P2PBuyButton__StyledButtonWithMessage-sc-1hj60ii-0 jGdipa']", elem => elem.click());
  // !NOTE! Be aware of the tab opening (should not happen here)
  const dapperPage = await page.evaluate("() => window.location.href")
  // click "click here" button directly when redirecting

  //purchaseOnDapper
  //await dapperPage.click("button[]", elem => elem.click());

  //open final page to check the purchase status
  const finalPage = await page.evaluate("() => window.location.href")
  return finalPage;

}

initBrowser()
goToTS()
purchaseOnTS()