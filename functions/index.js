/* eslint-disable no-await-in-loop */
const functions = require('firebase-functions');
const cors = require('cors')({origin:true});

const cheerio = require("cheerio");
const getUrls = require("get-urls");
const fetch = require("node-fetch");

const linkKeywords = ['contact', 'service', 'privacy', 'legal', 'policy', 'faq', 'policies', 'account', 'delete', 'disable', 'deactivate', 'help'];
const emailKeywords = ['privacy', 'support', 'contact', 'help', 'hello', 'policy', 'info'];
const deletePageKeywords = ['delete', 'deactivate', 'disable'];

function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

function interpretLink(link, homeSite) {
  if (link === null || link === undefined) {
    return link;
  }
  if (link.startsWith('//')) {
    link = "https:" + link;
  } else if (link.startsWith('/')) {
    link = homeSite + link;
  }
  return link;
}

/**
 * Given an HTML page url, find potential email links and "delete account" pages
 * @param {  } $ - URL of page to search for
 */
async function analyzePage(url, text, homeSite) {
  const res = await timeout(1000, fetch(url)).catch(e => {
    console.log(e);
    return null;
  });
  if (res === null) {
    return null;
  }
  const html = await res.text().catch(e => {
    console.log(e);
    return null;
  });

  const $ = cheerio.load(html, {
    withDomLvl1: true,
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: true
  });

  var links = [];
  var linksToInvestigate = [];
  var pipCandidates = [];
  $('*').find("a").each((i, e) => {
    var newLink = interpretLink($(e).attr('href'), homeSite);
    if (newLink !== undefined && newLink !== null && newLink.toLowerCase().startsWith('mailto:')) {
      var pipAddressCandidate = newLink.slice(7);
      if (pipAddressCandidate.indexOf('?') !== -1) {
        pipAddressCandidate = pipAddressCandidate.slice(0, pipAddressCandidate.indexOf('?'));
      }
      pipCandidates.push(pipAddressCandidate);
    } else if (newLink !== undefined && newLink !== null && links.indexOf(newLink) === -1 && newLink.indexOf(text.slice(8)) !== -1) {
      links[i] = newLink;
    }
  });
  for (link of links) {
    if (link === undefined || link === null) {
      continue;
    }
    for (keyword of linkKeywords) {
      if (link.toLowerCase().indexOf(keyword) !== -1) {
        linksToInvestigate.push(link);
      }
    }
  }

  var deletePage = false;
  var title = $('title').first().text();
  for (keyword of deletePageKeywords) {
    if (title.indexOf(keyword) !== -1) {
      deletePage = true;
    }
  }


  return {
    title: title,
    urlsToInvestigate: linksToInvestigate,
    deleteAccountPage: deletePage,
    pipCandidates: pipCandidates,
    url: url
  };
}

/**
 * Function that scrapes the web for data about privacy
 * @param { string } text - String of urls to search for
 */
const scrapeMetatags = (text) => {
  const urls = Array.from(getUrls(text));

  const requests = urls.map(async url => {
    const res = await timeout(5000, fetch(url)).catch(e => {
      console.log(e);
      return null;
    });
    const html = await res.text().catch(e => {
      console.log(e);
      return null;
    });
    const $ = cheerio.load(html, {
      withDomLvl1: true,
      normalizeWhitespace: false,
      xmlMode: false,
      decodeEntities: true
    });

    let pipAddress = '';
    let deleteAccountUrl = '';

    let imageSrc = $('link[rel="shortcut icon"]').attr('href');
    if (imageSrc === undefined) {
      imageSrc = $('link[rel="icon"]').attr('href');
    }
    if (imageSrc === undefined) {
      imageSrc=$('link[rel="SHORTCUT ICON"]').attr('href');
    }

    var links = [];
    var linksToInvestigate = [];
    var pipCandidates = [];
    $('*').find("a").each((i, e) => {
      var newLink = interpretLink($(e).attr('href'), url);
      if (newLink !== undefined && newLink !== null && newLink.toLowerCase().startsWith('mailto:')) {
        var pipAddressCandidate = newLink.slice(7);
        if (pipAddressCandidate.indexOf('?') !== -1) {
          pipAddressCandidate = pipAddressCandidate.slice(0, pipAddressCandidate.indexOf('?'));
        }
        pipCandidates.push(pipAddressCandidate);
      } else if (newLink !== undefined && newLink !== null && links.indexOf(newLink) === -1 && newLink.indexOf(text.slice(8)) !== -1) {
        links[i] = newLink;
      }
    });
    for (link of links) {
      if (link === undefined || link === null) {
        continue;
      }
      for (keyword of linkKeywords) {
        if (link.toLowerCase().indexOf(keyword) !== -1) {
          linksToInvestigate.push(link);
        }
      }
    }

    let temp = [];
    let visitedLinks = [];
    for (link of linksToInvestigate) {
      visitedLinks.push(link);
      var data = await analyzePage(link, text, url);
      if (data === null) {
        continue;
      }
      for (site of data.urlsToInvestigate) {
        if (temp.indexOf(site) === -1 && visitedLinks.indexOf(site) === -1 ) {
          temp.push(site);
        }
      }
      for (site of data.pipCandidates) {
        if (pipCandidates.indexOf(site)===-1) {
          pipCandidates.push(site);
        }
      }
      if (data.deleteAccountPage) {
        deleteAccountUrl = data.url;
      }
    }
    linksToInvestigate = temp;

    temp = [];
    for (link of linksToInvestigate) {
      visitedLinks.push(link);
      var pageInfo = await analyzePage(link, text, url);
      if (pageInfo === null) {
        continue;
      }
      for (site of pageInfo.urlsToInvestigate && visitedLinks.indexOf(site) === -1) {
        if (temp.indexOf(site)===-1) {
          temp.push(site);
        }
      }
      for (site of pageInfo.pipCandidates) {
        if (pipCandidates.indexOf(site) === -1) {
          pipCandidates.push(site);
        }
      }
      if (pageInfo.deleteAccountPage) {
        deleteAccountUrl = pageInfo.url;
      }
    }
    linksToInvestigate = temp;

    if (linksToInvestigate !== [] && visitedLinks !== []) {
      for (page of linksToInvestigate) {
        for (keyword of deletePageKeywords) {
          if (page.indexOf(keyword) !== -1) {
            deleteAccountUrl = page;
          }
        }
      }
      for (page of visitedLinks) {
        for (keyword of deletePageKeywords) {
          if (page.indexOf(keyword) !== -1) {
            deleteAccountUrl = page;
          }
        }
      }
    }

    if (pipCandidates.length > 0) {
      for (candidate of pipCandidates) {
        for (keyword of emailKeywords) {
          if (candidate.indexOf(keyword) !== -1) {
            pipAddress = candidate;
            break;
          }
        }
        if (pipAddress !== '') {
          break;
        }
      }
      if (pipAddress === '') {
        pipAddress = pipCandidates.pop();
      }
    }

    return {
      url,
      name: $('title').first().text(),
      logoSrc: imageSrc,
      pipAddress: pipAddress,
      deleteAccountUrl: deleteAccountUrl,
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
