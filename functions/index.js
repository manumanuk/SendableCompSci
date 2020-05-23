const functions = require('firebase-functions');
const cors = require('cors')({origin:true});

const cheerio = require("cheerio");
const getUrls = require("get-urls");
const fetch = require("node-fetch");

const scrapeMetatags = (text) => {
  const urls = Array.from(getUrls(text));

  const requests = urls.map(async url => {
    const res = await fetch(url).catch(e=>console.log(e));
    const html = await res.text().catch(e => console.log(e));
    const $ = cheerio.load(html);

    var links = [];
    $('*').find("a").each( (i, e) => {
      links[i] = $(e).attr('href');
    });

    let imageSrc = $('link[rel="shortcut icon"]').attr('href');
    if (imageSrc === undefined) {
      imageSrc = $('link[rel="icon"]').attr('href');
    }
    if (imageSrc === undefined) {
      imageSrc=$('link'[rel-"SHORTCUT ICON"].attr('href'));
    }

    return {
      url,
      title: $('title').first().text(),
      favicon: imageSrc,
      //links
    }
  });

  return Promise.all(requests);
}

exports.scraper = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const body = JSON.parse(request.body);
    const data = await scrapeMetatags(body.text).catch(e => console.log(e));
    response.send(data);
  });
});
