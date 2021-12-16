import chalk from "chalk";
import { cursorTo, clearScreenDown, emitKeypressEvents } from "readline";
import createWord from "./create-word.js";
const { stdout: pOut, stdin: pIn } = process;

let screen = Array(pOut.columns)
	.fill({})
	.map((o) => {
		let words = [createWord()];
		function addWord() {
			if (words.join("").length < pOut.rows) {
				words.push(createWord());
				addWord();
			}
		}
		addWord();

		return {
			words,
			pace: Math.floor(Math.random() * 9) + 1,
			offset: words[0].length
		};
	});

emitKeypressEvents(pIn);
pIn.setRawMode(true);

let text = "ENTER TARGET: ";
let red = false;
let canWrite = true;
pIn.on("keypress", (key, { ctrl, name }) => {
	if (name === "c" && ctrl) {
		process.exit();
	} else if (name === "return" && canWrite) {
		text = "HACK IN PROGRESS...";
		red = true;
		canWrite = false;
		setTimeout(() => {
			text = "FINISHED";
			red = false;
			setTimeout(() => {
				text = "ENTER TARGET: ";
				canWrite = true;
			}, 500);
		}, 2000);
	} else if (name === "backspace" && canWrite) {
		text = text.slice(0, -1);
	} else if (canWrite) {
		text += key;
	}
});

function clear() {
	cursorTo(pOut, 0, 0);
	clearScreenDown(pOut);
}

const interval = setInterval(tick, 100);
let time = 0;

function tick() {
	clear();
	time += 1;

	screen = screen.map(({ words, pace, offset }) => {
		let newOffset = offset;
		let newWords = [...words];

		if (time % pace === 0) {
			newOffset -= 1;

			if (newOffset === 0) {
				newWords.unshift(createWord());
			}

			if (newWords.slice(0, -1).join("").length > pOut.rows) {
				newWords.pop();
			}
		}

		return { words: newWords, pace, offset: newOffset };
	});

	for (let l = 0; l < pOut.rows - 1; l += 1) {
		screen.forEach(({ words, offset }, i) => {
			const center = l === Math.ceil(pOut.rows / 2);
			let letter = words.join("").slice(offset)[l] || " ";

			if (center && i > 2 && i < text.length + 3) {
				letter = chalk.white(text[i - 3]);
			}

			pOut.write(
				center
					? red
						? chalk.inverse.red(letter)
						: chalk.inverse.green(letter)
					: red
					? chalk.red(letter)
					: chalk.green(letter)
			);
		});
		pOut.write("\n");
	}
}
