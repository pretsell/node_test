const { HLTV } = require('hltv')
var request = require("request");
var sqlite3 = require("sqlite3").verbose();

function initDatabase(callback) {
	// Set up sqlite database.
	var db = new sqlite3.Database("data.sqlite");
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS data (name TEXT)");
		callback(db);
	});
}

function updateRow(db, value) {
	// Insert some data.
	var statement = db.prepare("INSERT INTO data VALUES (?)");
	statement.run(value);
	statement.finalize();
}

function readRows(db) {
	// Read some data.
	db.each("SELECT rowid AS id, name FROM data", function(err, row) {
		console.log(row.id + ": " + row.name);
	});
}

function fetchPage(url, callback) {
	// Use request to read in pages.
	request(url, function (error, response, body) {
		if (error) {
			console.log("Error requesting page: " + error);
			return;
		}

		callback(body);
	});
}

function run(db) {
    HLTV.getMatchesStats({startDate: '2018-05-.31', endDate: '2018-06-1'}).then(res => console.log(res))
        readRows(db);
        db.close();
}
HLTV.getMatchesStats({startDate: '2018-05-.31', endDate: '2018-06-1'}).then((res) => {
initDatabase(run);

//function run(db) {
//    HLTV.getMatch({id: 2306295}).then(res => handlerow(res))
//        readRows(db);
//        db.close();
//}
//function handlerow (res) {
//var value = res
//            updateRow(db, value);
//}
//initDatabase(run);
