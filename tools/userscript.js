/* eslint-env node */
import { readFileSync, writeFile } from 'fs';
import watch from 'node-watch';

const log = (...msg) => console.log(`[NodeJS] DBG ${[...msg]} ${performance.now()}ms`),
delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)),
nano = (template, data) => {
  return template.replace(/\{([\w\.]*)\}/g, (str, key) => {
    let keys = key.split('.'),
    v = data[keys.shift()];
    for(let i in keys.length) v = v[keys[i]];
    // for (let i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
    return typeof v !== 'undefined' && v !== null ? v : '';
  });
},
p = {
  dev: './dist/twittertranslator.dev.user.js',
  pub: './dist/twittertranslator.user.js',
},
js_env = process.env.JS_ENV === 'development',
jsonData = JSON.parse(readFileSync('./package.json', 'utf-8')),
buildUserJS = (evt, name) => {
  let header = readFileSync('./src/header.js').toString(),
  foreign = readFileSync('./dist/css/foreign.css').toString(),
  nitterCSS = readFileSync('./dist/css/useSiteColors.css').toString(),
  tetCSS = readFileSync('./dist/css/twittertranslator.css').toString(),
  lngList = readFileSync('./src/languages.js').toString(),
  code = readFileSync('./src/main.js').toString(),
  // code = transformFileSync('./src/main.js').code,
  renderOut = (outFile, jshead) => {
    let ujs = nano(header, {
      jshead: jshead,
      foreign: foreign,
      tetCSS: tetCSS,
      nitterCSS: nitterCSS,
      debugToggle: js_env ? true : false,
      languages: lngList,
      code: code
    });
    writeFile(outFile, ujs, (e) => {
      return (e) ? log(e) : log(`Build-path: ${outFile}`);
    });
  },
  time = +new Date(),
  langND = `// @name         ${js_env ? `[Dev] ${jsonData.productName}` : jsonData.productName}
// @name:bg      Външен преводач на Twitter
// @name:zh      Twitter外部翻译器
// @name:zh-CN   Twitter外部翻译器
// @name:zh-TW   Twitter外部翻译器
// @name:cs      Externí překladatel Twitter
// @name:da      Twitter ekstern oversætter
// @name:et      Twitteri väline tõlkija
// @name:fi      Twitter Ulkoinen kääntäjä
// @name:el      Εξωτερικός μεταφραστής Twitter
// @name:hu      Twitter külső fordító
// @name:lv      Twitter Ārējais tulkotājs
// @name:lt      'Twitter' išorinis vertėjas
// @name:ro      Twitter Traducător extern
// @name:sk      Externý prekladateľ Twitter
// @name:sl      Twitter Zunanji prevajalec
// @name:sv      Twitter Extern översättare
// @name:nl      Twitter Externe Vertaler
// @name:fr      Traducteur externe Twitter
// @name:de      Externer Twitter-Übersetzer
// @name:it      Traduttore esterno di Twitter
// @name:ja      ツイッター外部翻訳者
// @name:pl      Zewnętrzny tłumacz Twittera
// @name:pt      Tradutor externo do Twitter
// @name:pt-BR   Tradutor externo do Twitter
// @name:ru-RU   Twitter Внешний переводчик
// @name:ru      Twitter Внешний переводчик
// @name:es      Traductor externo de Twitter
// @description  ${jsonData.description}
// @description:zh      将第三方翻译添加到推特
// @description:zh-CN   将第三方翻译添加到推特
// @description:zh-TW   將第三方翻譯添加到推特
// @description:bg      Добавя преводачи на трети страни в Twitter
// @description:cs      Přidává překladatele třetích stran na Twitter
// @description:da      Tilføjer tredjepartsoversættere til Twitter
// @description:et      Lisab kolmanda osapoole tõlkijad Twitterisse
// @description:fi      Lisää kolmannen osapuolen kääntäjiä Twitteriin
// @description:el      Προσθέτει μεταφραστές 3ου μέρους στο Twitter
// @description:hu      Hozzáadja a 3. féltől származó fordítókat a Twitterhez
// @description:lv      Pievieno trešās puses tulkotājus Twitter
// @description:lt      Prideda trečiųjų šalių vertėjus į 'Twitter
// @description:ro      Adaugă traducători de la terțe părți la Twitter
// @description:sk      Pridáva prekladateľov tretích strán na Twitter
// @description:sl      Dodaja prevajalce tretjih oseb na Twitterju
// @description:sv      Lägger till översättare från tredje part till Twitter
// @description:nl      Voegt vertalers van derden toe aan Twitter
// @description:fr      Ajout de traducteurs tiers à Twitter
// @description:de      Fügt Drittanbieter-Übersetzer zu Twitter hinzu
// @description:it      Aggiunge traduttori di terze parti a Twitter
// @description:pl      Dodaje tłumaczy innych firm do Twittera
// @description:pt      Adiciona tradutores de terceiros ao Twitter
// @description:pt-BR   Adiciona tradutores de terceiros ao Twitter
// @description:ja      サードパーティの翻訳者をツイッターに追加
// @description:ru-RU   Добавляет сторонних переводчиков в Twitter
// @description:ru      Добавляет сторонних переводчиков в Twitter
// @description:es      Añade traductores de terceros a Twitter`,
  buildScript = `// ==UserScript==
${langND}
// @author       ${jsonData.author}
// @version      ${js_env ? time : jsonData.version}
// @icon         ${jsonData.userJS.icon}
// @downloadURL  ${jsonData.userJS.url}
// @updateURL    ${jsonData.userJS.url}
// @supportURL   ${jsonData.bugs.url}
// @namespace    ${jsonData.homepage}
// @homepageURL  ${jsonData.homepage}
// @license      GPL-3.0
// @connect      *
// @match        https://mobile.twitter.com/*
// @match        https://twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @match        https://www.twitlonger.com/show/*
// @match        https://nitter.*/*
// @match        https://nitter.*.*/*
// @match        https://nitter-home.kavin.rocks/*
// @match        https://birdsite.xanny.family/*
// @match        https://nttr.stream/*
// @match        https://lu-nitter.resolv.ee/*
// @match        https://twitter.076.ne.jp/*
// @match        https://notabird.site/*
// @match        https://n.hyperborea.cloud/*
// @match        https://twitter.censors.us/*
// @match        https://bird.trom.tf/*
// @match        https://twitr.gq/*
// @exclude      https://twitter.com/login
// @exclude      https://twitter.com/signup
// @exclude      https://twitter.com/i/flow/login
// @exclude      https://twitter.com/i/flow/signup
// @exclude      https://twitter.com/teams/*
// @exclude      https://twitter.com/*/authorize?*
// @exclude      https://twitter.com/*/begin_password_reset
// @exclude      https://twitter.com/account/*
// @exclude      https://mobile.twitter.com/i/flow/login
// @exclude      https://mobile.twitter.com/i/flow/signup
// @exclude      https://nitter.com
// @grant        document.cookie
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_info
// @grant        GM.info
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM.openInTab
// @compatible   Chrome
// @compatible   Firefox
// @noframes
// @run-at       document-body
// ==/UserScript==`;
  if(js_env) {
    // Development version
    renderOut(p.dev, buildScript);
  } else {
    // Release version
    renderOut(p.pub, buildScript);
  }
},
watcher = watch(['./src/'], { delay: 2500, filter: /\.js$/ });

log(`ENV: ${process.env.JS_ENV}`);

watcher.on('change', buildUserJS);

watcher.on('error', (e) => {
  log('ERROR',e);
  watcher.close();
  delay(5000).then(() => {buildUserJS()});
});

watcher.on('ready', buildUserJS);
// @grant        GM_getResourceText
// @grant        GM.getResourceText
// https://raw.githubusercontent.com/magicoflolis/twitter-translator/main/dist/icons
