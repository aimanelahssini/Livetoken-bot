
const puppeteer = require('puppeteer-extra');
const fs = require('fs').promises;

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
  '--single-process',
  '--no-zygote',
  '--no-sandbox'
]; 




async function initBrowser() {
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({headless: false, args: minimal_args});
    var page = await browser.newPage(); //avoid using newPage, opening a new Chromium tab could lead to bot detection

    /*
    //load my cookies
    const cookiesString = await fs.readFile('./cookies.json');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);

    //load my sessionStorage and localStorage
    const json = JSON.parse(fs.readFile("./livetoken.json", 'utf8'));
    await page.evaluate(json => {
    localStorage.clear();
    for (let key in json)
      localStorage.setItem(key, json[key]);
  }, json);
    */

    //setup personal cookies (google, livetoken, TS, Dapper)
    await page.goto('https://livetoken.co/deals/live');

    //click buy on LiveToken
    //wait for a certain element to load before clicking on it
    await page.waitForXPath("/html/body/div[2]/div[2]/div/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div[3]/button", {visible: true}); //not sure
    await page.click("button[class='btn buyButton btn-success btn-sm']", elem => elem.click());
    
    
    //Redefining the page var to the new tab
    const [target] = await Promise.all([
      new Promise(resolve => browser.once('targetcreated', resolve))
    ]);
    page = await target.page();
    await page.bringToFront();

    //click buy on TS
    await page.waitForXPath("/html/body/div[1]/div[3]/main/div[2]/div/div[3]/div/div[3]/div/button", {visible: true}); //try to remove visible?
    await page.click("button[class='ButtonBase__StyledButton-sc-1qgxh2e-0 gjCpfL Button__StyledButton-ig3kkl-1 yOxki P2PBuyButton__StyledButtonWithMessage-sc-1hj60ii-0 jGdipa']", elem => elem.click());


    }


initBrowser();



