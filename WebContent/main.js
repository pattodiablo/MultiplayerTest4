


class Boot extends Phaser.Scene {

	preload() {

		this.load.pack("pack", "assets/pack.json");
	}

	create() {
		this.scene.start("Scene1");


	}

}
