var http = require('http');
var bcrypt = require('bcrypt');
const saltRounds = 10;

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

        case '/getIssueType':
            if (req.method == 'POST') {

                req.on('data', function (data) {

                });
                req.on('end', async function () {
                    const {Client} = databaseType;
                    const client = new Client({
                        user: user,
                        password: password,
                        database: database,
                        port: port,
                        host: host,
                        ssl: ssl
                    });
                    await client.connect(); // create a database connection

                    client.query('SET search_path to faultreportapp');
                    // after the insertion, we return the complete table.
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
                req.on('end', async function () {
                    const {Client} = databaseType;
                    const client = new Client({
                        user: user,
                        password: password,
                        database: database,
                        port: port,
                        host: host,
                        ssl: ssl
                    });
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                    const res2 = await client.query('SELECT * FROM station'); // after the insertion, we return the complete table.
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    res.end(json_str_new);
                });
            }
            break;


        case '/getCoachNumber':
            if (req.method == 'POST') {
                var body = '';
                req.on('data', function (data) {
                    body += data;
                    req.on('end', async function () {
                        const {Client} = databaseType;
                        const client = new Client({
                            user: user,
                            password: password,
                            database: database,
                            port: port,
                            host: host,
                            ssl: ssl
                        });
                        await client.connect(); // create a database connection
                        client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                        const res2 = await client.query('SELECT * FROM coach WHERE coachNumber=' + data + ''); // after the insertion, we return the complete table.
                        await client.end();
                        json = res2.rows;
                        var json_str_new = JSON.stringify(json);
                        console.log("json_str_new: " + json_str_new);
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
                        const {Client} = databaseType;
                        const client = new Client({
                            user: user,
                            password: password,
                            database: database,
                            port: port,
                            host: host,
                            ssl: ssl
                        });
                        await client.connect(); // create a database connection
                        client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                        const res2 = await client.query('SELECT mapSource FROM coachMap INNER JOIN coach ON coachMap.coachMap_id = coach.coachMap_id WHERE coach.coachNumber=' + data + ';'); // after the insertion, we return the complete table.
                        await client.end();
                        json = res2.rows;
                        var json_str_new = JSON.stringify(json);
                        console.log("json_str_new: " + json_str_new);
                        res.end(json_str_new);
                    });
                });
            }
            break;
        case '/logincheck':
            if (req.method == 'POST') {
                console.log("POST /logincheck");
                var body = '';
                var json_str_new = '';
                req.on('data', function (data) {
                    body += data;
                    req.on('end', async function () {

                        var jsObject = JSON.parse(body);

                        const {Client} = databaseType;
                        const client = new Client({
                            user: user,
                            password: password,
                            database: database,
                            port: port,
                            host: host,
                            ssl: ssl
                        });

                        await client.connect(); // create a database connection
                        client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public

                        const res1 = await client.query('SELECT password FROM staff WHERE staff.email = ' + "'" + jsObject.userEmail + "'" + ';');
                        //console.log(res1);

                        var returnFormDataArray = [];
                        if(res1.rowCount >= 1){
                            //there is the user in database
                            const json_db_hash = res1.rows;
                            //console.log(json_db_hash);
                            const db_hash = json_db_hash[0].password;

                            const res2 = await client.query('SELECT staff_id, roletype, firstname, lastname, email FROM staff INNER JOIN roletype ON staff.roletype_id = roletype.roletype_id WHERE staff.email = ' + "'" + jsObject.userEmail + "'" + ';');

                            bcrypt.compare(jsObject.userPsw, db_hash, function (err, res) {
                                if (res == true) {
                                    console.log('success');
                                    const json_db = res2.rows;

                                    const staff_id = json_db[0].staff_id;
                                    const roletype = json_db[0].roletype;
                                    const firstname = json_db[0].firstname;
                                    const lastname = json_db[0].lastname;
                                    const email = json_db[0].email;

                                    var data = {
                                        authentication: 'success',
                                        staff_id:   staff_id,
                                        roletype:   roletype,
                                        firstname:  firstname,
                                        lastname:   lastname,
                                        userEmail:  email,
                                        userPsw:    db_hash,
                                        keepLogin:  jsObject.keepLogin
                                    };
                                    returnFormDataArray.push(data);

                                } else if (res == false) {
                                    console.log('fail');
                                    var data = {
                                        authentication: 'fail',
                                        staff_id:   'fail',
                                        roletype:   'fail',
                                        firstname:  'fail',
                                        lastname:   'fail',
                                        userEmail:  'fail',
                                        userPsw:    'fail',
                                        keepLogin:  jsObject.keepLogin
                                    };
                                    returnFormDataArray.push(data);
                                }
                            });
                        }else if (res1.rowCount == 0){
                            //the user does not exist in database
                            console.log('no user in database');
                            var data = {
                                authentication: 'noUser',
                                staff_id:   'noUser',
                                roletype:   'noUser',
                                firstname:  'noUser',
                                lastname:   'noUser',
                                userEmail:  'noUser',
                                userPsw:    'noUser',
                                keepLogin:  jsObject.keepLogin
                            };
                            returnFormDataArray.push(data);
                        }
                        await client.end();
                        json_str_new = JSON.stringify(returnFormDataArray);
                        res.end(json_str_new);


                        //-------------------------try to get hash value in order to insert into database---------------
                        // bcrypt.hash(jsObject.userPsw, saltRounds, function (err, hash) {
                        //     //var logInFormData = {};
                        //     //var key = 'key_logInFormData';
                        //     var logInFormData = [];
                        //     var data = {
                        //         userEmail: jsObject.userEmail,
                        //         userPsw: hash,
                        //         keepLogin: jsObject.keepLogin
                        //     };
                        //     logInFormData.push(data);
                        //     console.log(logInFormData); //json in array
                        //     //json_str_new = JSON.stringify(logInFormData);   //String js object
                        //     //console.log(json_str_new);
                        // });
                    });
                });
            }
            break

        default:
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('error');
    }
}).listen(8081); // listen to port 8081

