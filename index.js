const http = require("http");
const fs = require("fs");

//require statements
const getTimestamp = (date) => ({
  unix: date.getTime(),
  utc: date.toUTCString(),
});

const requestHandler = (req, res) => {
  if (req.url === "/") {
    //read the file provided in the first argument and execute
    fs.readFile("views/index.html", "utf8", (err, html) => {
      if (err) throw err;
      res.writeHead(200, { "content-Type": "text/html" });
      //sends the content file to the browser
      res.end(html);
    });
  } else if (req.url.startWith("/api/timestamp")) {
    const dateString = req.url.split("/api/timestamp/")[1];
    let timestamp;
    if (dateString === undefined || dateString.trim() === "") {
      timestamp = getTimestamp(new Date());
    } else {
      const date = !isNaN(dateString)
        ? new Date(parseInt(dateString))
        : new Date(dateString);
    }
    if (!isNaN(date.getTime())) {
      timestamp = getTimestamp(date);
    } else {
      timestamp = {
        error: "invalid date",
      };
    }

    res.writeHead(200, { "content-Type": "application/json" });
    res.end(JSON.stringify(timestamp));
  }
};

const server = http.createServer(requestHandler);

server.listen(process.env.PORT || 4000, (err) => {
  if (err) throw err;
  console.log(`Server running on PORT ${server.address().port}`);
});
