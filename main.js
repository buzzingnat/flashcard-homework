var inquirer = require('inquirer');
var fs = require('fs');

var basicCard = require('./basicCard.js');
var clozeCard = require('./clozeCard.js');

console.log(basicCard);
console.log(new basicCard('Ace', 1));

inquirer.prompt([{
	type: 'list',
	name: 'interactionMode',
	message: 'Welcome to Flashcards Forever!\nWhat would you like to do? (choose one)',
	choices: [
		{name: 'View existing cards', value: 'view'},
		{name: 'Create new cards', value: 'create'}
	]
}]).then(function (answers) {
    console.log(answers.interactionMode);
    if (answers.interactionMode === 'view') {
    	// read from a log.txt file
    	// fs.readFile('log.txt', function(){});
    	fs.readFile('log.txt', 'utf8', (err, data) => {
			if (err) throw err;
			console.log(JSON.parse(data, null, 2));
		});
    } else { // otherwise create was chosen
    	// fs.writeFileSync(file, data[, options]);
    	inquirer.prompt([{
			type: 'list',
			name: 'cardType',
			message: 'What kind of card would you like to make? (choose one)',
			choices: [
				{name: 'Basic Card', value: 'basic'},
				{name: 'Cloze Card', value: 'cloze'}
			]
		}]).then(function (answers) {
			var card;
			var a;
			var b;
			console.log('THE KIND OF CARD IS:', answers);
			if (answers.cardType === 'basic') {
				inquirer.prompt([{
					type: 'input',
					name: 'front',
					message: 'Text on FRONT of card:'
				}]).then(function (answers) {
					a = answers.front;
					inquirer.prompt([{
						type: 'input',
						name: 'back',
						message: 'Text on BACK of card:'
					}]).then(function (answers) {
						b = answers.back;
						card = new basicCard(a, b);
						console.log(card.front, card.back);
						saveBasicCard(card.front, card.back);
					});
				});
			} else {
				inquirer.prompt([{
					type: 'input',
					name: 'full',
					message: 'FULL text on card:'
				}]).then(function (answers) {
					a = answers.full;
					inquirer.prompt([{
						type: 'input',
						name: 'partial',
						message: `PARTIAL text to remove for cloze: (must be part of full text!)\n(full text for reference: ${a})`
					}]).then(function (answers) {
						b = answers.partial;
						card = new clozeCard(a, b);
						console.log(card);
						saveClozeCard(card.fullText, card.partialText, card.cloze);
					});
				});
			}
	    });
    }
});

function saveBasicCard(a, b) {
	fs.readFile('log.txt', 'utf8', (err, data) => {
		if (err) throw err;
		data = data.trim();
		var card = {front: a, back: b};
		if (data === '') {
			var data = [card];
			fs.writeFileSync('log.txt', `{"basic":` + JSON.stringify(data) + `,"cloze":[]}`, 'utf8');
			return;
		} else {
			data = JSON.parse(data);
			data.basic.push(card);
			fs.writeFileSync('log.txt', JSON.stringify(data), 'utf8');
			return;
		}
	});
}

function saveClozeCard(a, b, c) {
	fs.readFile('log.txt', 'utf8', (err, data) => {
		if (err) throw err;
		data = data.trim();
		if (a === undefined
			|| b === undefined
			|| c === undefined
			|| a === ""
			|| b === ""
			|| c === "") {
			console.log("Not a valid cloze card!");
			return;
		}
		var card = {fullText: a, partialText: b, cloze: c};
		if (data === '') {
			var data = [card];
			fs.writeFileSync('log.txt', `{"basic":[],"cloze":` + JSON.stringify(data) + `}`, 'utf8');
			return;
		} else {
			data = JSON.parse(data);
			data.cloze.push(card);
			fs.writeFileSync('log.txt', JSON.stringify(data), 'utf8');
			return;
		}
	});
}
