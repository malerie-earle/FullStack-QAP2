# FullStack-QAP2
<h3>Semester 3: QAP 2 – Full Stack JavaScript (Full Document Available)</h3>
<p>I was able to branch and merge once, otherwise I just committed directly to the main project. Did it in 2 big pieces (Server/Routes and Logging) and the rest was mostly small updates not features. (Didnt see the branch each feature part until it was too late)
Questions:
1. How many hours did it take you to complete this assessment? (Please keep try to keep track of how many hours you have spent working on each individual part of this assessment as best you can - an estimation is fine; we just want a rough idea.)
- All the questions kind of mixed together, about 5 hours spent on entire project.
2. What online resources you have used? (My lectures, YouTube, Stack overflow etc.)
- https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#information_responses
- https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter
- elfsight.com
- https://htmlcodeeditor.com/
- openweather.org
- w3 schools
- nodejs.org
3. Did you need to ask any of your friends in solving the problems. (If yes, please mention name of the friend. They must be amongst your class fellows.)
- No
4. Did you need to ask questions to any of your instructors? If so, how many questions did you ask (or how many help sessions did you require)?
- No
5. Rate (subjectively) the difficulty of each question from your own perspective, and whether you feel confident that you can solve a similar but different problem requiring some of the same techniques in the future now that you’ve completed this one.
- Medium difficulty</p>
<br />
<h1>Task 3 - Step 2: </h1>
<p>I am using the NPM module Winston to implement logging for various event scenarios. I am logging several events on my http server, including the following:
A.	Incoming Request Logging – Every time a request is received by the server, the method (ie, GET, POST, etc), and URL of the request are logged at the info level.
B.	Outgoing Response Logging – After a response is sent back to the client, the status code & message of the response are logged. If its an error, greater than (400s), then its logged as an error, if it’s a redirect (300s), it’s logged as a warning, otherwise, it is logged as info.
C.	File Reading Success Logging – Whenever a file is successfully read by the server, a success message is logged with info level, indicating which file was successfully read.
D.	File Not Found Logging – If a requested file is not found on the server, a warning message is logged indicating that a 404 Not Found error occurred for the requested URL.
E.	Exception Handling Logging – Any uncaught exceptions thrown during the execution of the server code are logged with error level and stored in an ‘exception.log’ file.
F.	Rejection Handling Logging – Any unhandled promise rejections are logged with error level and stored in a ‘rejections.log’ file.
G.	Log Rotation – Log files are rotated daily to prevent them from growing too large, and a maximum of 30 log files are kept, each covering a period of 30 days. 
This setup ensures comprehensive logging of various server events, including incoming requests, outgoing responses, file operations, and error handling, providing valuable insights into the server’s behavior and facilitating debugging and monitoring. It is divided into log directories, daily log files, logger captures errors, exceptions, and rejections, logging in separate files. </p>
![image](https://github.com/malerie-earle/FullStack-QAP2/assets/141525464/47efdf5c-2372-4311-a554-f796b31de62d)

