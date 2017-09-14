class ClozeCard {
	constructor(text, cloze) {
		if (!text.includes(cloze)) {
			console.log(`------------\nERROR: YOUR ANSWER DOES NOT CONTAIN YOUR CLOZE TEXT\n${text}\ndoes not include\n${cloze}\n\n`);
			return;
		} else {
			this.fullText = text;
			this.partialText = text.replace(cloze, "...");
			this.cloze = cloze;
		}
	}
}

module.exports = ClozeCard;
