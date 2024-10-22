// const express = require('express')
// const path = require('path')
// const PORT = process.env.PORT || 5000
//
// express()
//     .use(express.static(path.join(__dirname, 'public')))
//     .set('views', path.join(__dirname))
//     .engine('html', require('ejs').renderFile)
//     .set('view engine', 'html')
//     .get('/', (req, res) => res.render('index'))
//     .listen(PORT, () => console.log(`Listening on ${ PORT }`))


var express = require('express')
var app = express();

var port = process.env.PORT || 8081;

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/logincheck', function (req, res) {
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

    if (req.method == 'POST') {
        console.log("POST /logincheck");
        var body = '';

        req.on('data', function (data) {
            body += data;
            req.on('end', async function () {
                var json_str_new = '';
                var json_array = [];

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

                if (res1.rowCount >= 1) {
                    //there is the user in database
                    const json_db_hash = res1.rows;
                    //console.log(json_db_hash);
                    const db_hash = json_db_hash[0].password;

                    const res2 = await client.query('SELECT staff_id, roletype, firstname, lastname, email FROM staff INNER JOIN roletype ON staff.roletype_id = roletype.roletype_id WHERE staff.email = ' + "'" + jsObject.userEmail + "'" + ';');
                    const res3 = await client.query('SELECT report_id, report.staff_id, report.coachnumber, seatno, coordinate, faultdescription, timestamp, firstname, lastname, email, condition, coachmap_id, stationname, faultstatus, sublocation, locationtype, faultreference \n' +
                        'FROM report\n' +
                        'INNER JOIN staff ON report.staff_id = staff.staff_id\n' +
                        'INNER JOIN issuetype ON report.issuetype_id = issuetype.issuetype_id\n' +
                        'INNER JOIN fault ON report.fault_id = fault.fault_id\n' +
                        'INNER JOIN faultreference ON fault.faultreference_id = faultreference.faultreference_id\n' +
                        'INNER JOIN condition ON report.condition_id = condition.condition_id\n' +
                        'FULL JOIN coach ON report.coachnumber = coach.coachnumber\n' +
                        'INNER JOIN locationtype ON report.locationtype_id = locationtype.locationtype_id\n' +
                        'FULL JOIN station ON report.station_id = station.station_id\n' +
                        'INNER JOIN faultstatus ON report.faultstatus_id = faultstatus.faultstatus_id\n' +
                        'INNER JOIN sublocation ON fault.sublocation_id = sublocation.sublocation_id\n' +
                        'ORDER BY report_id;');
                    await client.end();

                    bcrypt.compare(jsObject.userPsw, db_hash, function (err, result) {
                        if (result == true) {
                            console.log('success');
                            const json_login = res2.rows;
                            const json_db = res3.rows;

                            ///LOGIN INFORMATION
                            const staff_id = json_login[0].staff_id;
                            const roletype = json_login[0].roletype;
                            const firstname = json_login[0].firstname;
                            const lastname = json_login[0].lastname;
                            const email = json_login[0].email;

                            var data = {
                                authentication: 'success',
                                staff_id: staff_id,
                                roletype: roletype,
                                firstname: firstname,
                                lastname: lastname,
                                userEmail: email,
                                userPsw: db_hash,
                                keepLogin: jsObject.keepLogin
                            };
                            json_array.push(data);
                            //LOGIN INFORMATION

                            for (let i = 0; i < json_db.length; i++) {
                                const report_id = json_db[i].report_id;
                                const staff_id = json_db[i].staff_id;
                                const coachnumber = json_db[i].coachnumber;
                                const seatno = json_db[i].seatno;
                                const coordinate = json_db[i].coordinate;
                                const faultdescription = json_db[i].faultdescription;
                                const timestamp = json_db[i].timestamp;
                                const firstname = json_db[i].firstname;
                                const lastname = json_db[i].lastname;
                                const email = json_db[i].email;
                                //const issuetype = json_db[i].issuetype;
                                //const fault = json_db[i].fault;
                                const condition = json_db[i].condition;
                                const coachmap_id = json_db[i].coachmap_id;
                                const stationname = json_db[i].stationname;
                                const faultstatus = json_db[i].faultstatus;
                                const sublocation = json_db[i].sublocation;
                                const locationtype = json_db[i].locationtype;
                                const faultreference = json_db[i].faultreference;

                                var data = {
                                    report_id: report_id,
                                    staff_id: staff_id,
                                    coachnumber: coachnumber,
                                    seatno: seatno,
                                    coordinate: coordinate,
                                    faultdescription: faultdescription,
                                    timestamp: timestamp,
                                    firstname: firstname,
                                    lastname: lastname,
                                    email: email,
                                    //issuetype:      issuetype,
                                    //fault:          fault,
                                    condition: condition,
                                    coachmap_id: coachmap_id,
                                    stationname: stationname,
                                    faultstatus: faultstatus,
                                    sublocation: sublocation,
                                    locationtype: locationtype,
                                    faultreference: faultreference
                                };
                                json_array.push(data);
                            }

                            json_str_new = JSON.stringify(json_array);
                            console.log('success: ' + json_str_new);
                            res.end(json_str_new);

                        } else if (result == false) {
                            console.log('fail');
                            var data = {
                                authentication: 'fail',
                                staff_id: 'fail',
                                roletype: 'fail',
                                firstname: 'fail',
                                lastname: 'fail',
                                userEmail: 'fail',
                                userPsw: 'fail',
                                keepLogin: jsObject.keepLogin
                            };
                            json_array.push(data);
                            json_str_new = JSON.stringify(json_array);
                            console.log('fail: ' + json_str_new);
                            res.end(json_str_new);
                        }
                    });
                } else if (res1.rowCount == 0) {
                    //the user does not exist in database
                    await client.end();
                    console.log('no user in database');
                    var data = {
                        authentication: 'noUser',
                        staff_id: 'noUser',
                        roletype: 'noUser',
                        firstname: 'noUser',
                        lastname: 'noUser',
                        userEmail: 'noUser',
                        userPsw: 'noUser',
                        keepLogin: jsObject.keepLogin
                    };
                    json_array.push(data);
                    json_str_new = JSON.stringify(json_array);
                    console.log('else if: ' + json_str_new);
                    res.end(json_str_new);
                }

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

});

app.listen(port, function () {
    console.log('app running')
});
