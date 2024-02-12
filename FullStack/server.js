const http = require('http');
const route = require('./routes.js');
const logger = require('./logEvents2.js');

// debug on/off toggle
global.DEBUG = false;

// Set log level to capture only warnings and errors
logger.level = 'warn';

// Creating http server
const server = http.createServer((req, res) => {
  
  // Log incoming request
  logger.info(`${req.method} ${req.url}`);
  
  // Log outgoing response status
  res.on('finish', () => {
    const statusCode = res.statusCode;
    if (statusCode >= 400) {
      logger.error(`HTTP ${statusCode}: ${res.statusMessage} - ${req.method} ${req.url}`);
    } else if (statusCode >= 300 && statusCode < 400) {
      logger.warn(`HTTP ${statusCode}: ${res.statusMessage} - ${req.method} ${req.url}`);
    } else {
      
      // Log all messages to log document
      logger.info(`HTTP ${statusCode}: ${res.statusMessage} - ${req.method} ${req.url}`);
    }
  });
  
  // Route handling
  let path = './views/';
  switch(req.url) {
    case '/':
      path += 'index.html';
      route.indexPage(path, res);
      break;

    case '/about':
      path += 'about.html';
      route.aboutPage(path, res);
      break;

    case '/contact':
      path += 'contact.html';
      route.contactPage(path, res);
      break;

    case '/products':
      path += 'products.html';
      route.productsPage(path, res);
      break;

    case '/subscribe':
      path += 'subscribe.html';
      route.subscribePage(path, res);
      break;

    case '/event':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('A route ${req.url} was requested');
      break;
    
    case '/folder':
      route.createFolder(req, res);
      break;

    default:
      logger.warn(`404 Not Found: ${req.url}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      break;
  }
});

// Start the server
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Error handling for server
server.on('error', (error) => {
  logger.error(`Server error: ${error.message}`);
});