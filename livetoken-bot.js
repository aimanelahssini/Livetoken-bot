/* The goal is to be able to run this on a RPi with a fiber connection */

/* 
 1. Disable images
 2. Disable CSS
 3. Set headless to true
https://www.scrapehero.com/how-to-increase-web-scraping-speed-using-puppeteer/ 
https://stackoverflow.com/questions/48773031/how-to-prevent-chrome-headless-from-loading-images

*/

// Run Puppeteer with Minimal settings
const puppeteer = require('puppeteer');

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

const browser = await puppeteer.launch({
  headless: true,
  args: minimal_args
})

async function initBrowser() {
  const browser = await puppeteer.launch({headless: false, args: minimal_args});
  const page = await browser.newPage();
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