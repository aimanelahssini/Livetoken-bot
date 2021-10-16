/* The goal is to be able to run this on a RPi with a fiber connection */

const puppeteer = require('puppeteer');

async function initBrowser() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://livetoken.co/deals/live');
  return page;
  //await browser.close()
}

/*
//setup flames to 3 and droplets to 3
async function setup(){

  //id vs2__combobox
  //input-> ar
  await page.mouse.click();
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
}

initBrowser()
goToTS()
purchaseOnTS