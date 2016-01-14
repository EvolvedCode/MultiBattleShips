var game = new Phaser.Game("100", "100", Phaser.CANVAS, '', null, true, { preload: preload, create: create, update: update }

function preload() {
	game.load.image('bship', 'assets/images/ships/');
	game.load.image('sub', 'assets/images/ships/');
	game.load.image('carrier', 'assets/images/ships/');
	game.load.image('patrol', 'assets/images/ships/');
	game.load.image('oilrig', 'assets/images/ships/');
}

function create() {
}

function update() {
}