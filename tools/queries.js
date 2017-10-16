// [["from", "to"], ["from", "to2"], ...]
// Names aren't forced to be unique, so it is possible two accounts got merged
// I do have unique ids, but lessons learned for the next time
// The ? are usually unicode characters, they display correctly on the site
// but the database doesn't like them a lot

var util = require("util");
var from = {};
var persons = {};
var output = "";

for (var k = 0; k < reputations.length; k++) {
	// No people with no name, accounts before I saved names
	// I can give them a unique id, but since I forgot to do that this time around
	// before exporting it form the database, I don't feel like going trough the trouble
	if (reputations[k][0] == null || reputations[k][1] == null) continue;

	// Check if this from -> to combination has already appeared
	from[reputations[k][0]] = from[reputations[k][0]] || [];
	if (from[reputations[k][0]].indexOf(reputations[k][1]) !== -1) {
		persons[reputations[k][0]].totalGiven++;
		persons[reputations[k][1]].totalReceived++;
		continue;
	}
	from[reputations[k][0]].push(reputations[k][1]);
	
	// Initialize every person at 0
	persons[reputations[k][0]] = persons[reputations[k][0]] || {given: 0, received: 0, totalGiven: 0, totalReceived: 0};
	persons[reputations[k][1]] = persons[reputations[k][1]] || {given: 0, received: 0, totalGiven: 0, totalReceived: 0};
	
	persons[reputations[k][0]].given++;
	persons[reputations[k][1]].received++;
}

for (var name in persons) {
	// Generate a row for every person, escaping their name just to be sure
	output += name.replace("\t", "\\t") + "\t" + persons[name].given + "\t" + persons[name].received + "\t" + persons[name].totalGiven + "\t" + persons[name].totalReceived + "\n";
}

// Put it in the clipboard
require('child_process').spawn('clip').stdin.end(util.inspect(output));