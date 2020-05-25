const functions = require('firebase-functions');
const cors = require('cors')({origin:true});

const cheerio = require("cheerio");
const getUrls = require("get-urls");
const fetch = require("node-fetch");

/**
 * Function that scrapes the web for data about privacy
 * @param { string } text - String of urls to search for
 */
const scrapeMetatags = (text) => {
  const urls = Array.from(getUrls(text));

  const requests = urls.map(async url => {
    const res = await fetch(url).catch(e=> {
      console.log(e);
      return null;
    });
    const html = await res.text().catch(e => {
      console.log(e);
      return null;
    });
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
      name: $('title').first().text(),
      logoSrc: imageSrc,
      pipAddress: "",
      deleteAccountUrl: ""
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
