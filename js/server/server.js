var http = require('http');

// the quick and dirty trick which prevents crashing.
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

http.createServer(function (req, res) {
    console.log(req.url)
    console.log(req.method)

    // Website you wish to allow to connect
    // add this line to address the cross-domain XHR issue.
    res.setHeader('Access-Control-Allow-Origin', '*');

    switch (req.url) {
        case '/getIssueType':
            if (req.method == 'POST') {
                console.log("POST");
                var body = '';
                req.on('data', function (data) {
                    body += data;
                    console.log("Partial body: " + body);
                });
                req.on('end', async function () {
                    console.log("Body: " + body);
                    var json = JSON.parse(body)
                    //console.log("name is " + json.studentName) // get name
                    console.log("not succesful yet ");

                    const {Client} = require('pg');
                    const connectionString = 'postgresql://sunghimlui:dbpassword@localhost:5432/GAfaultReportdb';

                    const client = new Client({
                        connectionString: connectionString,
                    });
                    await client.connect(); // create a database connection

                    console.log("Successful");

                    // after the insertion, we return the complete table.
                    const res2 = await client.query('SELECT * FROM staff');
                    console.log(res2);
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    console.log(json_str_new);
                    res.end(json_str_new);
                });

            }
            break;
        default:
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('error');
    }
}).listen(8081); // listen to port 8081

