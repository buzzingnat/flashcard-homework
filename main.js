var inquirer = require('inquirer');
var fs = require('fs');

var basicCard = require('./basicCard.js');
var clozeCard = require('./clozeCard.js');

function mainLoop() {
	inquirer.prompt([{
		type: 'list',
		name: 'interactionMode',
		message: 'Welcome to Flashcards Forever!\nAt any time, hit [control]+[c] to quit the program.\nWhat would you like to do? (choose one)',
		choices: [
			{name: 'View existing cards', value: 'view'},
			{name: 'Create new cards', value: 'create'}
		]
	}]).then(function (answers) {
	    if (answers.interactionMode === 'view') {
	    	// read from a log.txt file
	    	fs.readFile('log.txt', 'utf8', (err, data) => {
				if (err) throw err;
				console.log(JSON.parse(data, null, 2));
				mainLoop();
			});
	    } else { // otherwise create was chosen
	    	inquirer.prompt([{
				type: 'list',
				name: 'cardType',
				message: 'What kind of card would you like to make? (choose one)',
				choices: [
					{name: 'Basic Card', value: 'basic'},
					{name: 'Cloze Card', value: 'cloze'}
				]
			}]).then(function (answers) {
				var card, a, b;
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
							saveBasicCard(card.front, card.back);
							mainLoop();
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
							saveClozeCard(card.fullText, card.partialText, card.cloze);
							mainLoop();
						});
					});
				}
		    });
	    }
	});
}

function saveBasicCard(a, b) {
	fs.readFile('log.txt', 'utf8', (err, data) => {
		if (err) throw err;
		data = data.trim();
		var card = {front: a, back: b};
		if (a === undefined
			|| b === undefined
			|| a === ""
			|| b === "") {
			console.log("\n\nNot a valid card!\n\n");
			return;
		} else if (data === '') {
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
		var card = {fullText: a, partialText: b, cloze: c};
		if (a === undefined
			|| b === undefined
			|| c === undefined
			|| a === ""
			|| b === ""
			|| c === "") {
			console.log("\n\nNot a valid card!\n\n");
			return;
		} else if (data === '') {
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

mainLoop();
