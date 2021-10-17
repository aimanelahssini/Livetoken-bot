
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
  //'--single-process',
  '--no-zygote',
  '--no-sandbox'
]; 

async function initBrowser() {
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({headless: false, args: minimal_args});
    const page = await browser.newPage(); //avoid using newPage, opening a new Chromium tab could lead to bot detection
    //setup personal cookies (google, livetoken, TS, Dapper)
    await page.goto('https://livetoken.co/deals/live');

    //wait for a certain element to load before clicking on it
    await page.WaitForSelector("button[class='btn buyButton btn-success btn-sm']", {visible: true}); //not sure

    await page.click("button[class='btn buyButton btn-success btn-sm']", elem => elem.click());
      // !NOTE! Be aware of the tab opening
    //const tsPage = await page.evaluate("() => window.location.href")
    //await page.goto(tsPage);
    }

    async function goToTS(){
      //4 seconds to setup the flames and droplets
      await page.waitForTimeout(4000)
    
      //wait for a certain element to load before clicking on it
      await page.WaitForSelectorAsync("btn buyButton btn-success btn-sm"); //not sure
      await page.click("button[class='btn buyButton btn-success btn-sm']", elem => elem.click());
      // !NOTE! Be aware of the tab opening
      const tsPage = await page.evaluate("() => window.location.href")
    
    }

initBrowser();



