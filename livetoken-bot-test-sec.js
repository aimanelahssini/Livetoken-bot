/*
  delete
  "random-useragent": "^0.5.0", //delete?
  "user-agents": "^1.0.806"
*/

const puppeteer = require('puppeteer-extra');
require('dotenv').config();

// ! Check minimal args for bot detection
const minimal_args = [
  '--disable-gpu',
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
  '--no-sandbox',
  `--window-size=1200,768`
]; 

async function initPage(browser){
  //Redefining the page var to the new tab
  [target] = await Promise.all([
    new Promise(resolve => browser.once('targetcreated', resolve))
  ]);
  page = await target.page();
  await page.bringToFront();
  return page;
}


async function secOptions(page){
  // evaluate XPath expression of the target selector (it return array of ElementHandle)
  let elHandle = await page.$x("/html/body/div[2]/div[2]/div/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div[9]/div");
  // prepare to get the textContent of the selector above (use page.evaluate)
  let sec = await page.evaluate(el => el.textContent, elHandle[0]);
  sec = await sec.substring(0,2);
  

  if(sec !== '1m' && sec !== '2m' && sec < 32) {
    console.log('Bingo! ' + sec);
    //click buy on LiveToken
    await page.waitForXPath("/html/body/div[2]/div[2]/div/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div[3]/button");
    await page.click("button[class='btn buyButton btn-success btn-sm']", elem => elem.click());
    //add another thread where buying the moment will continue
    //continue on this thread to snipe more moments at the same time
    //keep adding threads for every moment under 32 
  } else {
    //wait 1sec and reiterate
    console.log("Too late! " + sec);
    secOptions(page);
  };
};

async function initBrowser() { 
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({headless: false, args: minimal_args});
    let page = await browser.newPage(); //avoid using newPage, opening a new Chromium tab could lead to bot detection

    //setup personal cookies (google, livetoken, TS, Dapper)
    await page.goto('https://livetoken.co/deals/live');
    // wait for XPath to load
    await page.waitForXPath("/html/body/div[2]/div[2]/div/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div[9]/div"); //not sure
    secOptions(page);

    //Redefining the page var to the new tab
    page = await initPage(browser);

    //click buy on Top Shot
    await page.waitForXPath("/html/body/div[1]/div[3]/main/div[2]/div/div[3]/div/div[3]/div/button"/*, {visible: true} */); //try to remove visible?
    await page.click("button[class='ButtonBase__StyledButton-sc-1qgxh2e-0 gjCpfL Button__StyledButton-ig3kkl-1 yOxki P2PBuyButton__StyledButtonWithMessage-sc-1hj60ii-0 jGdipa']");
    await page.click("#__next > div.AppTemplate__Wrapper-d5brw1-1.kvEiEU > main > div.MomentDetailed__HeaderWrapper-sc-5jlx8i-0.kbLqCz > div > div.MomentDetailed__HeaderInsert-sc-5jlx8i-6.kUeIEt > div > div.MintedHeaderInsert__BuyUIWrapper-sc-85mwfw-1.bTdwyU > div > button");

    //check if making a function of this would make the script faster or slower
    //Redefining the page var to the new tab
    page = await initPage(browser);

    //click buy on Dapper
    await page.waitForSelector("#__next > main > div > main > div.css-10u1lvi > div.css-jqhguc > div.css-1gyhwz1 > button.css-wae9sn"/*, {visible: true} */); //try to remove visible?
    /* await page.waitForSelector("#__next"); //more efficient*/
    await page.click("#__next > main > div > main > div.css-10u1lvi > div.css-jqhguc > div.css-1gyhwz1 > button.css-wae9sn']");
    //await page.waitForSelector("#__next > div.AppTemplate__Wrapper-d5brw1-1.kvEiEU > main > div.MomentDetailed__HeaderWrapper-sc-5jlx8i-0.kbLqCz > div > div.MomentDetailed__HeaderInsert-sc-5jlx8i-6.kUeIEt > div > div.MintedHeaderInsert__BuyUIWrapper-sc-85mwfw-1.bTdwyU > div > button");
    await page.click("#__next > div.AppTemplate__Wrapper-d5brw1-1.kvEiEU > main > div.MomentDetailed__HeaderWrapper-sc-5jlx8i-0.kbLqCz > div > div.MomentDetailed__HeaderInsert-sc-5jlx8i-6.kUeIEt > div > div.MintedHeaderInsert__BuyUIWrapper-sc-85mwfw-1.bTdwyU > div > button");


    //Redefining the page var to the new tab
    await initPage(browser);
    await page.waitForSelector("#__next > main > div > main > div.css-10u1lvi > div.css-jqhguc > div.css-1gyhwz1 > button.css-wae9sn");
    await page.click("#__next > main > div > main > div.css-10u1lvi > div.css-jqhguc > div.css-1gyhwz1 > button.css-wae9sn");

    }

initBrowser();