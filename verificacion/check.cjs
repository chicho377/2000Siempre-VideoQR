const { chromium } = require('C:/Users/Dell/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
const browser = await chromium.launch({headless:true,channel:"msedge"});
const page = await browser.newPage({viewport:{width:1440,height:1100}});
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:8080');
await page.screenshot({path:'verificacion/inicio-desktop.png',fullPage:true,animations:"disabled"});
await page.locator('.community').click();
await assert.equal(await page.locator('#comunidad').isVisible(),true);
await page.locator('video').evaluate(v=>v.load());
await page.waitForFunction(()=>document.querySelector('video').readyState>=1);
const video = await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight}));
assert.ok(video.duration>0);
await page.locator('#comunidad .back').click();
await page.locator('.teleton').click();
await page.locator('#next').click();
assert.equal(await page.locator('#page-status').textContent(),'2 / 2');
await page.locator('#next').click();
assert.equal(await page.locator('#page-status').textContent(),'1 / 2');
await page.locator('.carousel').focus(); await page.keyboard.press('ArrowLeft');
assert.equal(await page.locator('#page-status').textContent(),'2 / 2');
await page.goBack(); assert.equal(await page.locator('#inicio').isVisible(),true);
for(const width of [320,390,768,1440]){
await page.setViewportSize({width,height:900});
for(const route of ['inicio','comunidad','mini-teleton']){
await page.goto(`http://localhost:8080/#${route}`);
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${route} ${width}`);
}
}
await page.setViewportSize({width:390,height:844});
await page.goto('http://localhost:8080/#inicio');
await page.screenshot({path:'verificacion/inicio-movil.png',fullPage:true,animations:"disabled"});
await page.goto('http://localhost:8080/#mini-teleton');
await page.screenshot({path:'verificacion/mini-teleton-movil.png',fullPage:true,animations:"disabled"});
// Inject a local fixture only in this browser to test real-image paths without changing delivered content.
await page.route('**/gallery.js', route=>route.fulfill({contentType:'text/javascript',body:`window.MINI_TELETON_PHOTOS=Array.from({length:5},(_,i)=>({src:'assets/portadaVideo.png',alt:'Fotografía de prueba '+(i+1)}));`}));
await page.reload();
assert.equal(await page.locator('#pending-notice').isVisible(),false);
await page.locator('.photo').first().click();
assert.equal(await page.locator('dialog').isVisible(),true);
await page.keyboard.press('Escape');
assert.equal(await page.locator('dialog').isVisible(),false);
assert.equal(await page.locator('.photo').first().evaluate(el=>el===document.activeElement),true);
await page.locator('#next').click();
assert.equal(await page.locator('.gallery-page:not([aria-hidden="true"]) .photo').count(),1);
assert.deepEqual(errors,[]);
console.log(JSON.stringify({result:'PASS',viewports:[320,390,768,1440],video,checks:['navigation','history','direct links','carousel wrap','keyboard','image modal and focus','no horizontal overflow','no JavaScript errors']},null,2));
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});


