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
    const databaseType = require('pg');
    const user = "ehhhvbzcacarfb";
    const password = "eb2a4f3825b5a9d3763ca124ca27be1e7c28ebf11f0ff99498c4328a50b635e2";
    const database = "dbq2fnkh4o7js8";
    const port = 5432;
    const host = "ec2-54-247-70-127.eu-west-1.compute.amazonaws.com";
    const ssl = true;

    switch (req.url) {

        case '/getLocationType':
            if (req.method == 'POST') {
                req.on('data', function () {});
                    req.on('end', async function () {
                        const {Client} = databaseType;
                        const client = new Client({user: user,password: password, database: database,port: port,host: host,ssl: ssl});
                        await client.connect(); // create a database connection
                        client.query('SET search_path to faultreportapp');
                        const res2 = await client.query('SELECT * FROM locationType');
                        await client.end();
                        json = res2.rows;
                        var json_str_new = JSON.stringify(json);
                        console.log(json_str_new);
                        res.end(json_str_new);
                    });
            }
            break;

        case '/getIssueType':
            if (req.method == 'POST') {
                req.on('data', function () {});
                req.on('end', async function () {
                    const {Client} = databaseType;
                    const client = new Client({user: user,password: password, database: database,port: port,host: host,ssl: ssl});
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp');
                    const res2 = await client.query('SELECT * FROM issueType');
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    console.log(json_str_new);
                    res.end(json_str_new);
                });
            }
            break;

        case '/getStation':
            if (req.method == 'POST') {

                req.on('data', function () {
                    req.on('end', async function () {
                        const {Client} = databaseType;
                        const client = new Client({user: user,password: password, database: database,port: port,host: host,ssl: ssl});
                        await client.connect(); // create a database connection
                        client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                        const res2 = await client.query('SELECT * FROM station'); // after the insertion, we return the complete table.
                        await client.end();
                        json = res2.rows;
                        var json_str_new = JSON.stringify(json);
                        console.log(json_str_new);
                        res.end(json_str_new);
                    });
                });
            }
            break;

        case '/getCoachNumber':
            if (req.method == 'POST') {
                //var body = '';
                req.on('data', function (data) {
                    //body += data;
                req.on('end', async function () {
                    const {Client} = databaseType;
                    const client = new Client({user: user,password: password, database: database,port: port,host: host,ssl: ssl});
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                    const res2 = await client.query('SELECT * FROM coach WHERE coachNumber='+data+''); // after the insertion, we return the complete table.
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    //console.log("json_str_new: "+json_str_new);
                    res.end(json_str_new);
                });
                });
            }
            break;

        case '/getCoachMap':
            if (req.method == 'POST') {
                req.on('data', function (data) {
                    req.on('end', async function () {
                        const {Client} = databaseType;
                        const client = new Client({user: user,password: password, database: database,port: port,host: host,ssl: ssl});
                        await client.connect(); // create a database connection
                        client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                        const res2 = await client.query('SELECT mapSource FROM coachMap INNER JOIN coach ON coachMap.coachMap_id = coach.coachMap_id WHERE coach.coachNumber='+ data +';'); // after the insertion, we return the complete table.
                        await client.end();
                        json = res2.rows;
                        var json_str_new = JSON.stringify(json);
                        //console.log("json_str_new: "+json_str_new);
                        res.end(json_str_new);
                    });
                });
            }
            break;

        case '/getSubLocation':
            if (req.method == 'POST') {
                var body = '';
                req.on('data', function (data) {
                    body+=data;
                });
                console.log("BODY: "+body);
                req.on('end', async function () {
                    const {Client} = databaseType;
                    const client = new Client({user: user,password: password,database: database,port: port,host: host,ssl: ssl});
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                    const res2 = await client.query('SELECT * FROM sublocation WHERE locationType_id = ' + body + ' ORDER BY sublocation ASC;'); // after the insertion, we return the complete table.
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    //console.log("json_str_new: "+json_str_new);
                    res.end(json_str_new);
                });

            }
            break;

        case '/getfaultObjects':
            if (req.method == 'POST') {
                var body = '';
                req.on('data', function (data) {
                    body+=data;
                });
                req.on('end', async function () {
                    const {Client} = databaseType;
                    const client = new Client({user: user,password: password,database: database,port: port,host: host,ssl: ssl});
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                    const res2 = await client.query('select fault_id,faultreference from faultreference inner join fault on faultreference.faultreference_id=fault.faultreference_id where sublocation_id = '+body+' order by faultreference ASC; '); // after the insertion, we return the complete table.
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    console.log("json_str_new: "+json_str_new);
                    res.end(json_str_new);
                });

            }
            break;



        default:
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('error');
    }
}).listen(8081); // listen to port 8081

