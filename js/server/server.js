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

    //set to postgre
    const {Client} = require('pg');

    const client = new Client({
        user: "ehhhvbzcacarfb",
        password: "eb2a4f3825b5a9d3763ca124ca27be1e7c28ebf11f0ff99498c4328a50b635e2",
        database: "dbq2fnkh4o7js8",
        port: 5432,
        host: "ec2-54-247-70-127.eu-west-1.compute.amazonaws.com",
        ssl: true
    });

    switch (req.url) {
        case '/getIssueType':
            if (req.method == 'POST') {
                var body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', async function () {
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                    const res2 = await client.query('SELECT * FROM issueType'); // after the insertion, we return the complete table.
                    //console.log(res2);
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    console.log(json_str_new);
                    res.end(json_str_new);
                });
            }

            //finish this later for getting the station
        case '/getStation':
            if (req.method == 'POST') {
                var body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', async function () {
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                    const res2 = await client.query('SELECT * FROM station'); // after the insertion, we return the complete table.
                    //console.log(res2);
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    //console.log(json_str_new);
                    res.end(json_str_new);
                });
            }
            break;

        //finish this later for getting the station

        case '/getCoachNumber':
            if (req.method == 'POST') {
                var body = '';
                req.on('data', function (data) {
                    body += data;
                req.on('end', async function () {
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                    const res2 = await client.query('SELECT * FROM coach WHERE coachNumber='+data+''); // after the insertion, we return the complete table.
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    console.log("json_str_new: "+json_str_new);
                    res.end(json_str_new);
                });
                });
            }
            break;

        case '/getCoachMap':
            if (req.method == 'POST') {
                var body = '';
                req.on('data', function (data) {
                    body += data;
                    req.on('end', async function () {
                        await client.connect(); // create a database connection
                        client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                        const res2 = await client.query('SELECT * FROM coachMap WHERE coachNumber='+data+''); // after the insertion, we return the complete table.
                        await client.end();
                        json = res2.rows;
                        var json_str_new = JSON.stringify(json);
                        console.log("json_str_new: "+json_str_new);
                        res.end(json_str_new);
                    });
                });
            }
            break;

        default:
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('error');
    }
}).listen(8081); // listen to port 8081

