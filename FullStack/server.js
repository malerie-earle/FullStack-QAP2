const http = require('http');
const route = require('./routes.js');
const { logger } = require('./logEvents.js');

// debug on/off toggle
global.DEBUG = false;

// Set log level to capture only warnings and errors
logger.level = 'warn';

// Creating http server
const server = http.createServer((req, res) => {
  
  // Log incoming request
  logger.info(`Server Started: ${req.method} ${req.url}`);
  
  // Route handling
  let path = './views/';
  switch(req.url) {
    // Home page / root
    case '/':
      path += 'index.html';
      route.indexPage(path, res);
      break;

    // Redirect from '/old-path' to '/new-path'
    case '/old-path':
      res.writeHead(302, { 'Location': '/new-path' });
      res.end();
      break;

    // About page
    case '/about':
      path += 'about.html';
      route.aboutPage(path, res);
      break;

    // Contact page
    case '/contact':
      path += 'contact.html';
      route.contactPage(path, res);
      break;

    // Products page
    case '/products':
      path += 'products.html';
      route.productsPage(path, res);
      break;

    // Subscribe page
    case '/subscribe':
      path += 'subscribe.html';
      route.subscribePage(path, res);
      break;

    // Event route
    case '/event':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`A route ${req.url} was requested`);
      break;
    
    // Folder creation route
    case '/folder':
      route.createFolder(req, res);
      res.writeHead(201, { 'Content-Type': 'text/plain' });
      res.end('Folder created');
      break;

    // Teapot route - The HTTP 418 I'm a teapot client error response code indicates that the server refuses to brew coffee because it is, permanently, a teapot. A combined coffee/tea pot that is temporarily out of coffee should instead return 503. This error is a reference to Hyper Text Coffee Pot Control Protocol defined in April Fools' jokes in 1998 and 2014.
    case '/teapot':
      res.writeHead(418, { 'Content-Type': 'text/plain' });
      res.end("I'm a teapot");
      break;

    // default route or 404 Not Found
    default:
      logger.warn(`404 Not Found: ${req.url}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      break;
}
  // Set a cookie
  res.setHeader('Set-Cookie', ['theme=dark']);

  // Read a cookie
  const cookies = req.headers.cookie;  // 'theme=dark'


    // Log outgoing response status
    res.on('finish', () => {
      const statusCode = res.statusCode;
      if (statusCode >= 400) {
        logger.error(`HTTP ${statusCode}: ${res.statusMessage} - ${req.method} ${req.url}`);
      } else if (statusCode >= 300 && statusCode < 400) {
        logger.warn(`HTTP ${statusCode}: ${res.statusMessage} - ${req.method} ${req.url}`);
      } else {
      
      // Log all messages
      logger.info(`HTTP ${statusCode}: ${res.statusMessage} - ${req.method} ${req.url}`);
    }
  });
});

// Start the server
const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Error handling for server
server.on('error', (error) => {
  logger.error(`Server error: ${error.message}`);
});

