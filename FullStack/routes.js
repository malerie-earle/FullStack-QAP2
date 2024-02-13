const fs = require('fs');
const request = require('request'); // Include request module for API request
const myEmitter = require('./logEvents2.js');

function indexPage(path, response) {
  myEmitter.emit('route', path);
  
  // Fetch weather information
  let apiKey = '13b0ca5ebe008598c874a456a8b415e7';
  let city = "St. John's, NL, Canada";
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
  request(url, function (err, apiResponse, body) {
    if(err){
      console.log('error:', err);
      renderHomePageWithError(path, response);
    } else {
      const weatherData = JSON.parse(body);
      renderHomePageWithWeather(path, response, weatherData);
    }
  });
}

function renderHomePageWithWeather(path, response, weatherData) {
  // Read index.html file
  fs.readFile(path, (error, content) => {
    if(error) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('500 Internal Server Error');
    } else {
      // Modify HTML content to include weather information
      let modifiedContent = content.toString();
      modifiedContent += `<center>`;
      modifiedContent += `<div id="openweathermap-widget-1"></div>`;
      modifiedContent += `<script src='//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js'></script><script>window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  window.myWidgetParam.push({id: 1,cityid: '6324733',appid: '0b3ec26be7772b84ba1063d85631b09b',units: 'metric',containerid: 'openweathermap-widget-1',  });  (function() {var script = document.createElement('script');script.async = true;script.charset = "utf-8";script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(script, s);  })();</script>`;
      modifiedContent += `<br />`;
      modifiedContent += `<iframe width="700" height="1600" src="https://rss.app/embed/v1/imageboard/tsf0aCa6kLtpOVGg" frameborder="0" style = "border-radius: 10px;"></iframe>`;
      modifiedContent += `</center>`;

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(modifiedContent, 'utf-8');
    }
  });
}

function renderHomePageWithError(path, response) {
  // Read index.html file
  fs.readFile(path, (error, content) => {
    if(error) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('500 Internal Server Error');
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(content, 'utf-8');
    }
  });
}

// function aboutPage(path, response) {
//   myEmitter.emit('route', path);
//   fetchFile(path, response)
// }

// function contactPage(path, response) {
//   myEmitter.emit('route', path);
//   fetchFile(path, response)
// }

// function productsPage(path, response) {
//   myEmitter.emit('route', path);
//   fetchFile(path, response)
// }

// function subscribePage(path, response) {
//   myEmitter.emit('route', path);
//   fetchFile(path, response)
// }

// function createFolder(request, response) {
//   const folderName = 'newFolder';
//   fs.mkdir(folderName, (error) => {
//     if(error) {
//       if(DEBUG) console.error(error); 
//       myEmitter.emit('event', request.url, 'ERROR', 'A new folder was NOT created');
//       response.writeHead(500, { 'Content-Type': 'text/plain' });
//       response.end('500 Internal Server Error');
//     } else {
//       myEmitter.emit('event', request.url, 'SUCCESS', 'A new folder was created');
//       response.writeHead(200, { 'Content-Type': 'text/plain' });
//       response.end('New folder created');
//     }
//   });
// }

// function fetchFile(fileName, response) {
//   fs.readFile(fileName, (error, content) => {
//     if(error) {
//       response.writeHead(500, { 'Content-Type': 'text/plain' });
//       response.end('500 Internal Server Error');
//     } else {
//       response.writeHead(200, { 'Content-Type': 'text/html' });
//       response.end(content, 'utf-8');
//     }
//   });
// };

module.exports = {
  aboutPage,
  contactPage,
  productsPage,
  subscribePage,
  indexPage,
  createFolder
}
