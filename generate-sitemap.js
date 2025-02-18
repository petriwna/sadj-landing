const { createWriteStream } = require('fs');
const { resolve } = require('path');

const { SitemapStream, streamToPromise } = require('sitemap');

const domain = 'https://saucepan-did-mazaj.web.app/';
const pages = [{ url: '/', changefreq: 'daily', priority: 1.0 }];

// Створення SitemapStream
const sitemapStream = new SitemapStream({ hostname: domain });

// Створення writeStream для запису в sitemap.xml
const writeStream = createWriteStream(resolve(__dirname, 'src/public/sitemap.xml'));

// Додавання сторінок до sitemap
pages.forEach((page) => sitemapStream.write(page));

// Завершення потоку
sitemapStream.end();

// Очікуємо на завершення генерації та записуємо в файл
streamToPromise(sitemapStream)
  .then(() => {
    console.log('✅ Sitemap generated!');
  })
  .catch((err) => {
    console.error('❌ Error generating sitemap:', err);
  });

// Перенаправлення потоку sitemapStream до writeStream
sitemapStream.pipe(writeStream);
