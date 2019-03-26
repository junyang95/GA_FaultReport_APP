var http = require('http');
var bcrypt = require('bcrypt');

var http = require('http');
var formidable = require('formidable');
var multiparty = require('multiparty');
var fs = require('fs');
var path = require('path');
var util = require('util');

var dir = './tmp';

const saltRounds = 10;

//AWS module


const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'eu-west-1';

//const aws = require('aws-sdk');
//const fs = require('fs');
/*const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});*/


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
    const user = "grysmyvgqarcud";
    const password = "54a23367c1e9db4e9390b354912944ae7192a70165527175a5cc888cdb28040b";
    const database = "d68dbsr2imbev5";
    const port = 5432;
    const host = "ec2-54-228-243-238.eu-west-1.compute.amazonaws.com";
    const ssl = true;

    switch (req.url) {

        case '/uploadImage':
            if (req.method == 'POST') {
                var body='';

                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', async function () {
                    var json = JSON.parse(body);
                    console.log("JSON: "+json);
                var form = new multiparty.Form();
                console.log("About to parse...");

                form.parse(req, function(error, fields, files) {

                    /*if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                        var oldpath = dir;
                        var newpath = '../../image/reportImage/' + json;

                        fs.rename(oldpath, newpath, function (err) {
                            if (err) throw err;
                            res.write('File uploaded and moved!');

                            res.end(util.inspect({fields: fields, files: files}));

                        });*/

                        var oldpath = files.filetoupload.path;
                        var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
                        fs.rename(oldpath, newpath, function (err) {
                            if (err) throw err;
                            res.write('File uploaded and moved!');
                            res.end();
                        });

                    /*form.parse(req, function(err, fields, files){
                        console.log(files.file.path);
                    });*/

                    //console.log("Parsing done.");
                    //console.dir(req.headers);
                    //console.log(fields);
                    //console.log(files);
                });



            });
            }

            break;

        case '/submitForm':
            if (req.method == 'POST') {
                var body = '';

                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', async function () {
                    var json = JSON.parse(body);

                    const {Client} = databaseType;
                    const client = new Client({user: user,password: password, database: database,port: port,host: host,ssl: ssl});
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp');

                    const insertReport = 'INSERT INTO report (locationType_id,coachNumber,station_id,subLocation_id,fault_id,condition_id,otherValue,seatNo,xCoordinateTrainMap, yCoordinateTrainMap,platformNumber,faultAdditionalInfo,faultStatus_id,staff_id,email) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *';
                    const insertImage = 'INSERT INTO image (report_id, imageSource) VALUES((SELECT MAX(report_id) FROM report), $1)  RETURNING *';

                    if(!json.image){
                        const reportValue = [json.locationType, json.coachNumber, json.station, json.sublocation, json.fault, json.condition, json.otherValue, json.seatNumber, json.xCoordinate, json.yCoordinate, json.platformNumber,json.additionInformation, json.faultStatus, json.staff_id,json.email];
                        await client.query(insertReport, reportValue);

                    }else{
                        const reportValue = [json.locationType, json.coachNumber, json.station, json.sublocation, json.fault, json.condition, json.otherValue, json.seatNumber, json.xCoordinate, json.yCoordinate, json.platformNumber,json.additionInformation, json.faultStatus, json.staff_id,json.email];
                        const imageValue = [json.image];

                        await client.query(insertReport, reportValue);
                        await client.query(insertImage, imageValue);
                    }

                    res.end();

                });
            }
            break;

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case '/sign-s3':
            if (req.method == 'GET') {
                req.on('data', function () {});
                req.on('end', async function () {

                    const s3 = new aws.S3();
                    const fileName = req.query['file-name'];
                    const fileType = req.query['file-type'];
                    const s3Params = {
                        Bucket: S3_BUCKET,
                        Key: fileName,
                        Expires: 60,
                        ContentType: fileType,
                        ACL: 'public-read'
                    };
                    s3.getSignedUrl('putObject', s3Params, (err, data) => {
                        if(err){
                            console.log(err);
                            return res.end();
                        }
                        const returnData = {
                            signedRequest: data,
                            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
                        };
                        res.write(JSON.stringify(returnData));
                        res.end();
                    });
                });
            }
            break;

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
                        //console.log(json_str_new);
                        res.end(json_str_new);
                    });
            }
            break;

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case '/getIssueType':
            if (req.method == 'POST') {
                req.on('data', function () {});
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
                    const res2 = await client.query('SELECT * FROM issueType');
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    //console.log(json_str_new);
                    res.end(json_str_new);
                });
            }
            break;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case '/getStation':
            if (req.method == 'POST') {

                console.log("Hi");
                req.on('data', function () {});
                req.on('end', async function () {
                    const {Client} = databaseType;
                    const client = new Client({user: user,password: password, database: database,port: port,host: host,ssl: ssl});
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp');
                    const res2 = await client.query('SELECT * FROM station');
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    console.log(json_str_new);
                    res.end(json_str_new);
                });
            }
            break;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case '/getSubLocation':
            if (req.method == 'POST') {
                var body = '';
                req.on('data', function (data) {
                    body+=data;
                });
                //console.log("BODY: "+body);
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

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case '/getfaultObjects':
            if (req.method == 'POST') {
                var body='';
                req.on('data', function (data) {
                    body+=data;

                req.on('end', async function () {
                    const {Client} = databaseType;
                    const client = new Client({user: user,password: password,database: database,port: port,host: host,ssl: ssl});
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                    const res2 = await client.query('SELECT fault_id,faultreference FROM faultreference INNER JOIN fault ON faultreference.faultreference_id=fault.faultreference_id WHERE sublocation_id = '+body+' ORDER BY faultreference ASC; '); // after the insertion, we return the complete table.
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    //console.log("json_str_new: "+json_str_new);
                    res.end(json_str_new);
                });
                });
            }
            break;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case '/getfaultCondition':
            if (req.method == 'POST') {
                var body = '';
                req.on('data', function (data) {
                    body+=data;

                req.on('end', async function () {
                    const {Client} = databaseType;
                    const client = new Client({user: user,password: password,database: database,port: port,host: host,ssl: ssl});
                    await client.connect(); // create a database connection
                    client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public
                    const res2 = await client.query('select * from condition order by condition ASC;'); // after the insertion, we return the complete table.
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    //console.log("json_str_new: "+json_str_new);
                    res.end(json_str_new);
                });
                });
            }
            break;

            case '/updatestatus':
            if (req.method == 'POST') {
                console.log("POST /detail");
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
                        const res1 = await client.query('UPDATE report\n' +
                            'SET faultstatus_id = faultstatus.faultstatus_id \n' +
                            'FROM faultstatus\n' +
                            'WHERE faultstatus =' + "'" + jsObject.update_faultstatus + "'" + 'AND report_id =' + jsObject.report_id);

                        const res2 = await client.query('SELECT faultstatus\n' +
                            'FROM report\n' +
                            'INNER JOIN faultstatus ON report.faultstatus_id = faultstatus.faultstatus_id\n' +
                            'WHERE report_id = ' + jsObject.report_id + ';')
                        await client.end();
                        const json_db = res2.rows;

                        const faultstatus = json_db[0].faultstatus;

                        data = {
                            faultstatus: faultstatus
                        };

                        json_array.push(data);
                        json_str_new = JSON.stringify(json_array);
                        console.log('success: ' + json_str_new);
                        res.end(json_str_new);
                    });
                });
            }

            break;
        case '/detail':
            if (req.method == 'POST') {
                console.log("POST /detail");
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
                        const res1 = await client.query('SELECT report_id, staff.staff_id, report.coachnumber, seatno, xcoordinatetrainmap, ycoordinatetrainmap,faultadditionalinfo, timestamp, firstname, lastname, report.email, condition, coachmap.coachmap_id, stationname, faultstatus, sublocation, locationtype, faultreference, roletype, mapsource, othervalue, platformnumber \n' +
                            'FROM report\n' +
                            'FULL JOIN staff ON report.email = staff.email\n' +
                            'FULL JOIN roletype ON staff.roletype_id = roletype.roletype_id\n' +
                            'FULL JOIN fault ON report.fault_id = fault.fault_id\n' +
                            'FULL JOIN faultreference ON fault.faultreference_id = faultreference.faultreference_id\n' +
                            'FULL JOIN condition ON report.condition_id = condition.condition_id\n' +
                            'FULL JOIN coach ON report.coachnumber = coach.coachnumber\n' +
                            'FULL JOIN coachmap ON coach.coachmap_id = coachmap.coachmap_id\n' +
                            'INNER JOIN locationtype ON report.locationtype_id = locationtype.locationtype_id\n' +
                            'FULL JOIN station ON report.station_id = station.station_id\n' +
                            'INNER JOIN faultstatus ON report.faultstatus_id = faultstatus.faultstatus_id\n' +
                            'FULL JOIN sublocation ON fault.sublocation_id = sublocation.sublocation_id\n' +
                            'WHERE report_id = ' + jsObject.report_id + ';');
                        await client.end();
                        //console.log(res1);
                        const json_db = res1.rows;

                        for (let i = 0; i < json_db.length; i++) {
                            const report_id = json_db[i].report_id;
                            const staff_id = json_db[i].staff_id;
                            const coachnumber = json_db[i].coachnumber;
                            const seatno = json_db[i].seatno;
                            const xcoordinatetrainmap = json_db[i].xcoordinatetrainmap;
                            const ycoordinatetrainmap = json_db[i].ycoordinatetrainmap;
                            const faultadditionalinfo = json_db[i].faultadditionalinfo;
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
                            const roletype = json_db[i].roletype;
                            const mapsource = json_db[i].mapsource;
                            const othervalue = json_db[i].othervalue;
                            const platformnumber = json_db[i].platformnumber;

                            var data = {
                                report_id: report_id,
                                staff_id: staff_id,
                                coachnumber: coachnumber,
                                seatno: seatno,
                                xcoordinatetrainmap: xcoordinatetrainmap,
                                ycoordinatetrainmap: ycoordinatetrainmap,
                                faultadditionalinfo: faultadditionalinfo,
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
                                faultreference: faultreference,
                                roletype: roletype,
                                mapsource: mapsource,
                                othervalue: othervalue,
                                platformnumber: platformnumber
                            };

                            json_array.push(data);
                        }


                        json_str_new = JSON.stringify(json_array);
                        console.log('success: ' + json_str_new);
                        res.end(json_str_new);
                    });
                });
            }


            break;
        case '/filter':
            if (req.method == 'POST') {
                console.log("POST /filter");
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

                        let sortCondition = '';
                        if (jsObject.status != undefined && jsObject.location != undefined) {
                            sortCondition = 'WHERE faultstatus =' + "'" + jsObject.status + "'" + ' AND locationtype =' + "'" + jsObject.location + "'";

                        } else if (jsObject.status == undefined && jsObject.location != undefined) {
                            sortCondition = 'WHERE locationtype =' + "'" + jsObject.location + "'";

                        } else if (jsObject.status != undefined && jsObject.location == undefined) {
                            sortCondition = 'WHERE faultstatus =' + "'" + jsObject.status + "'";

                        } else if (jsObject.status == undefined && jsObject.location == undefined) {
                            sortCondition = sortCondition;
                        }

                        if (jsObject.sortby != undefined) {
                            sortCondition = sortCondition + ' ORDER BY ' + jsObject.sortby;
                        }

                        console.log(sortCondition);

                        client.query('SET search_path to faultreportapp'); //to go to the 'faultreportapp' schema rather than public

                        const res1 = await client.query('SELECT report_id, staff.staff_id, report.coachnumber, seatno, faultadditionalinfo, timestamp, firstname, lastname, report.email, condition, coachmap_id, stationname, faultstatus, sublocation, locationtype, faultreference \n' +
                            'FROM report\n' +
                            'FULL JOIN staff ON report.email = staff.email\n' +
                            'FULL JOIN fault ON report.fault_id = fault.fault_id\n' +
                            'FULL JOIN faultreference ON fault.faultreference_id = faultreference.faultreference_id\n' +
                            'FULL JOIN condition ON report.condition_id = condition.condition_id\n' +
                            'FULL JOIN coach ON report.coachnumber = coach.coachnumber\n' +
                            'INNER JOIN locationtype ON report.locationtype_id = locationtype.locationtype_id\n' +
                            'FULL JOIN station ON report.station_id = station.station_id\n' +
                            'INNER JOIN faultstatus ON report.faultstatus_id = faultstatus.faultstatus_id\n' +
                            'FULL JOIN sublocation ON fault.sublocation_id = sublocation.sublocation_id\n' +
                            sortCondition + ';');
                        //console.log(res1);
                        await client.end();
                        const json_db = res1.rows;

                        for (let i = 0; i < json_db.length; i++) {
                            const report_id = json_db[i].report_id;
                            const staff_id = json_db[i].staff_id;
                            const coachnumber = json_db[i].coachnumber;
                            const seatno = json_db[i].seatno;
                            const faultadditionalinfo = json_db[i].faultadditionalinfo;
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
                                faultadditionalinfo: faultadditionalinfo,
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
                    });
                });
            }

            break;
        case '/logincheck':
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
                            const res3 = await client.query('SELECT report_id, staff.staff_id, report.coachnumber, seatno, faultadditionalinfo, timestamp, firstname, lastname, report.email, condition, coachmap_id, stationname, faultstatus, sublocation, locationtype, faultreference \n' +
                                'FROM report\n' +
                                'FULL JOIN staff ON report.email = staff.email\n' +
                                'FULL JOIN fault ON report.fault_id = fault.fault_id\n' +
                                'FULL JOIN faultreference ON fault.faultreference_id = faultreference.faultreference_id\n' +
                                'FULL JOIN condition ON report.condition_id = condition.condition_id\n' +
                                'FULL JOIN coach ON report.coachnumber = coach.coachnumber\n' +
                                'INNER JOIN locationtype ON report.locationtype_id = locationtype.locationtype_id\n' +
                                'FULL JOIN station ON report.station_id = station.station_id\n' +
                                'INNER JOIN faultstatus ON report.faultstatus_id = faultstatus.faultstatus_id\n' +
                                'FULL JOIN sublocation ON fault.sublocation_id = sublocation.sublocation_id\n' +
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
                                        const faultadditionalinfo = json_db[i].faultadditionalinfo;
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
                                            faultadditionalinfo: faultadditionalinfo,
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
            break;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        default:
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('Connection error');
    }
}).listen(8081); // listen to port 8081

