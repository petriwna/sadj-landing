const { createWriteStream } = require('fs');
const { resolve } = require('path');

const { SitemapStream, streamToPromise } = require('sitemap');

const domain = 'https://frying-pan-didmazaj.web.app/';
const pages = [
    {
        url: '/',
        changefreq: 'daily',
        priority: 1.0,
        img: [
            {
                url: `${domain}images/frying-hero.png`,
                title: 'Головний банер сайту',
                caption: 'Чавунна сковорода ТМ СИТОН'
            },
            {
                url: `${domain}images/descript_1.jpg`,
                title: 'Велика чавунна сковорода',
                caption: 'Чавунна сковорода ТМ СИТОН'
            },
            {
                url: `${domain}images/desription_2.jpg`,
                title: 'Велика чавунна сковорода',
                caption: 'Чавунна сковорода ТМ СИТОН'
            },
            {
                url: `${domain}images/description_3.jpg`,
                title: 'Велика чавунна сковорода',
                caption: 'Чавунна сковорода ТМ СИТОН'
            },
            {
                url: `${domain}images/frying-size.png`,
                title: 'Розміри чавунної сковороди',
                caption: 'Литий чавунний посуд без покриття 26см * 6см'
            }
        ],
    },
];

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
