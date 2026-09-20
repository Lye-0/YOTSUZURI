async (page) => {
const out='C:/Users/kawau/Documents/MY DEVELOPMENT TEMP/脱出ゲーム/4_YOTSUZURI/verification/';
const click=async(l)=>{await l.evaluate(e=>e.click());await page.waitForTimeout(40)};
const close=async()=>{if(await page.locator('dialog').count())await click(page.getByRole('button',{name:'閉じて部屋に戻る',exact:true}))};
const go=async(room)=>{await close();const current=await page.evaluate(()=>JSON.parse(localStorage.getItem('yotsuzuri:save:v1')).room);if(current===room)return;await click(page.getByRole('button',{name:'見取り図',exact:true}));await click(page.locator('.map-grid>button').nth(room))};
await close();await page.setViewportSize({width:1440,height:1000});
for(let room=0;room<11;room++){await go(room);await page.screenshot({path:out+'final-room-'+room+'.png',fullPage:true});}
const issues=[];await page.setViewportSize({width:390,height:844});
for(let room=0;room<11;room++){await go(room);const names=await page.locator('.hotspot:not(.hidden-panel)').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));for(const name of names){await click(page.locator('.hotspot').filter({has:page.locator('span',{hasText:name})}));const size=await page.locator('dialog').evaluate(e=>({name:e.querySelector('h2')?.textContent,width:e.clientWidth,scroll:e.scrollWidth}));if(size.scroll>size.width+2)issues.push(size);const id=await page.locator('[data-puzzle]').getAttribute('data-puzzle');if(['4','7','12','16','24','30'].includes(id))await page.screenshot({path:out+'mobile-'+id+'.png',fullPage:true});await close();}}
await go(10);await click(page.getByRole('button',{name:'閉じた本',exact:true}));await page.locator('.exit-action').scrollIntoViewIfNeeded();await page.screenshot({path:out+'mobile-exit-control.png',fullPage:true});const exitVisible=await page.locator('.exit-action').isVisible();await close();return {checked:30,viewport:'390x844',issues,exitVisible};
}
