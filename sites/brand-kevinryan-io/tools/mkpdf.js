const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const pg = await b.newPage();
  await pg.goto('file:///home/claude/brand/public/index.html', { waitUntil: 'load' });
  await pg.emulateMedia({ media: 'screen' });
  const H = await pg.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 800) { await pg.evaluate(v => scrollTo(0, v), y); await pg.waitForTimeout(50); }
  await pg.waitForTimeout(1000);
  await pg.pdf({
    path: '/home/claude/brand/public/kra-brand-guidelines.pdf',
    format: 'A4', printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await b.close(); console.log('ok');
})();
