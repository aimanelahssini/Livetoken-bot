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
  '--no-sandbox'
]; 



async function loginGoogleLTTS(page, browser){

  const delay = ms => new Promise(res => setTimeout(res, ms));

  await page.setViewport({ width: 1280, height: 800 });
  await page.goto("https://livetoken.co/myaccount");


  await delay(2000);
  await page.waitForSelector("#login > a");
  await page.click("#login > a", elem => elem.click());
  await page.waitForSelector("#googleBtn", {visible: true});
  await page.click("#googleBtn");

  //Redefining the page var to the new tab
  const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));	
  const popup = await newPagePromise;

  await popup.waitForSelector('input[type="email"]', {visible: true});
  await popup.type('input[type="email"]', process.env.GOOGLE_USER);
  await popup.click("#identifierNext");

  await popup.waitForSelector('input[type="password"]', {visible: true});
  await popup.type('input[type="password"]', process.env.GOOGLE_PWD);

  await popup.waitForSelector("#passwordNext > div > button > div.VfPpkd-Jh9lGc", {visible: true});
  await popup.click("#passwordNext > div > button > div.VfPpkd-Jh9lGc");

  
  await delay(5000);
  await page.goto("https://auth.meetdapper.com/login?state=hKFo2SBpV2M1Ujgyc0l1cUpUT19iT1hYZF95U3RfZjk3WF9YMKFupWxvZ2luo3RpZNkgOV81dEhTT1Z2WWFzOFBKMEVjNUttZ015NTcyUDV0MVKjY2lk2SA3NTZLQ3ZpaXU2VkFTMW5iZXRqVWprNjRPY1owWXY4cg&client=756KCviiu6VAS1nbetjUjk64OcZ0Yv8r&protocol=oauth2&access_type=offline&redirect_uri=https%3A%2F%2Fnbatopshot.com%2Fapi%2Fauth0%2Fcallback&response_type=code&scope=openid%20profile%20offline_access%20email");
  await page.waitForSelector("#root > div > div > div.css-1mvm84l > div.css-12x0iee");
  await page.click("#root > div > div > div.css-1mvm84l > div.css-12x0iee");
  await delay(20000);
  // Try to store session now https://stackoverflow.com/questions/57987585/puppeteer-how-to-store-a-session-including-cookies-page-state-local-storage
}

async function initPage(browser){
  //Redefining the page var to the new tab
  [target] = await Promise.all([
    new Promise(resolve => browser.once('targetcreated', resolve))
  ]);
  page = await target.page();
  await page.bringToFront();
  return page;
}


async function initBrowser() {
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({headless: false, args: minimal_args});
    let page = await browser.newPage(); //avoid using newPage, opening a new Chromium tab could lead to bot detection

    //login to Google, LT and TS
    await loginGoogleLTTS(page, browser);

    //setup personal cookies (google, livetoken, TS, Dapper)
    await page.goto('https://livetoken.co/deals/live');

    const sec = page.$eval("#app > div.content.container-fluid > div > div:nth-child(2) > div > div > div.row.rTable > div > div > div > div:nth-child(2) > div > div > div.cell.whenListed > div");
    console.log(sec);
    if( sec <= 29 ){
      //click buy on LiveToken
    await page.waitForXPath("/html/body/div[2]/div[2]/div/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div[3]/button"); //not sure
    await page.click("button[class='btn buyButton btn-success btn-sm']", elem => elem.click());
    
    } else {
      console.log("no!");
    }
    
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



