var KEYS = ['c', 'd', 'e', 'f'];
var NOTE_DURATION = 750;

// NoteBox
//
// Acts as an interface to the coloured note boxes on the page, exposing methods
// for playing audio, handling clicks,and enabling/disabling the note box.
function NoteBox(key, onClick) {
	// Create references to box element and audio element.
	var boxEl = document.getElementById(key);
	var audioEl = document.getElementById(key + '-audio');
	if (!boxEl) throw new Error('No NoteBox element with id' + key);
	if (!audioEl) throw new Error('No audio element with id' + key + '-audio');

	// When enabled, will call this.play() and this.onClick() when clicked.
	// Otherwise, clicking has no effect.
	var enabled = true;
	// Counter of how many play calls have been made without completing.
	// Ensures that consequent plays won't prematurely remove the active class.
	var playing = 0;

	this.key = key;
	this.onClick = onClick || function () {};

	// Plays the audio associated with this NoteBox
	this.play = function () {
		playing++;
		// Always play from the beginning of the file.
		audioEl.currentTime = 0;
		audioEl.play();

		// Set active class for NOTE_DURATION time
		boxEl.classList.add('active');
		setTimeout(function () {
			playing--
			if (!playing) {
				boxEl.classList.remove('active');
			}
		}, NOTE_DURATION)
	}

	// Enable this NoteBox
	this.enable = function () {
		enabled = true;
	}

	// Disable this NoteBox
	this.disable = function () {
		enabled = false;
	}

	// Call this NoteBox's clickHandler and play the note.
	this.clickHandler = function () {
		if (!enabled) return;

		this.onClick(this.key)
		this.play()
	}.bind(this)

	boxEl.addEventListener('mousedown', this.clickHandler);
}

// Nicks' Code for creating a Simon Game.
const MAX_SEQUENCE_LENGTH = 5;

function getRandomKey() {
	return KEYS[Math.floor(Math.random() * KEYS.length)];
}

class SimonGame {
	constructor(winCallback = () => {}, loseCallback = () => {}) {
		this.winCallback = winCallback;
		this.loseCallback = loseCallback;
		this.reset();
	}

	reset() {
		this.isStopped = false;
		this.round = 1;
		this.playerSequence = [];
		this.solutionSequence = Array.from({length: MAX_SEQUENCE_LENGTH}, getRandomKey);
	}

	playCurrentSequnce() {
		let i = 0;
		const playingInterval = setInterval(() => {
			notes[this.solutionSequence[i]].play();
			i++;
			if (i >= this.round) {
				clearInterval(playingInterval);
			}
		}, NOTE_DURATION);
	}

	addPlayerKey(key) {
		if (this.isStopped) {
			return;
		}

		if (key !== this.solutionSequence[this.playerSequence.length]) {
			this.loseCallback();
			this.isStopped = true;
			return;
		}

		this.playerSequence.push(key);
		if (this.playerSequence.length === this.solutionSequence.length) {
			this.winCallback();
			this.isStopped = true;
			return;
		}

		if (this.playerSequence.length === this.round) {
			this.playerSequence = [];
			this.round++;
			setTimeout(this.playCurrentSequnce.bind(this), NOTE_DURATION * 2);
		}
	}
}

function win() {
	document.getElementById('message').innerHTML = 'Congrats, you won! :)'
}

function lose() {
	document.getElementById('message').innerHTML = 'Game Over, you lost! :('
}

// Example usage of NoteBox.
//
// This will create a map from key strings (i.e. 'c') to NoteBox objects so that
// clicking the corresponding boxes on the page will play the NoteBox's audio.
// It will also demonstrate programmatically playing notes by calling play directly.
var notes = {};

KEYS.forEach(function (key) {
	notes[key] = new NoteBox(key, game.addPlayerKey.bind(game));
});

// KEYS.concat(KEYS.slice().reverse()).forEach(function(key, i) {
// 	setTimeout(notes[key].play.bind(null, key), i * NOTE_DURATION);
// });

let game = new SimonGame(win, lose);
game.playCurrentSequnce();
