/* The goal is to be able to run this on a RPi with a fiber connection */

/* 
SPEED ENHANCEMENT
 1. Disable images
 2. Disable CSS
 3. Set headless to true
https://www.scrapehero.com/how-to-increase-web-scraping-speed-using-puppeteer/ 
https://stackoverflow.com/questions/48773031/how-to-prevent-chrome-headless-from-loading-images
 4. Write clean code (https://medium.com/@bretcameron/13-tips-to-write-faster-better-optimized-javascript-dc1f9ab063d8)

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
      Use your own logging cookies, to avoid logging in every time you launch the bot
      Use sessions? (https://www.worthwebscraping.com/how-to-use-cookies-and-session-in-python-web-scraping/)

 8. Use stealth plugin (https://www.npmjs.com/package/puppeteer-extra-plugin-stealth)

*/

// Run Puppeteer with Minimal settings & Stealth plugin
const puppeteer = require('puppeteer-extra');

// ! Check minimal args for bot detection
const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
]; 

async function initBrowser() {
  const StealthPlugin = require('puppeteer-extra-plugin-stealth');
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({headless: false, args: minimal_args});
  const page = await browser.newPage(); //avoid using newPage, opening a new Chromium tab could lead to bot detection
  //setup personal cookies (google, livetoken, TS, Dapper)
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
  await page.waitForTimeout(2000)

  //wait for a certain element to load before clicking on it
  await page.WaitForSelectorAsync("btn buyButton btn-success btn-sm"); //not sure
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

