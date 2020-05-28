
// You can write more code here

/* START OF COMPILED CODE */

class Scene1 extends Phaser.Scene {

	constructor() {

		super("Scene1");

	}

	_preload() {

		this.load.pack("pack", "assets/pack.json");

	}

	_create() {

		this.add.image(1920.0, 1080.0, "spaceBG");

		this.fMainPlayer = this.add.group([  ]);
		this.fNetworkPlayers = this.add.group([  ]);


	}



	/* START-USER-CODE */
	preload() {
		this._preload();



		}

	moveplayer(pointer){
	if(typeof(this.fplayer) != "undefined"){

		let cursor = pointer;
	  let angle = Phaser.Math.Angle.Between(this.fplayer.x, this.fplayer.y, cursor.x + this.cameras.main.scrollX, cursor.y + this.cameras.main.scrollY);

		}
	}

	create() {

		this._create();

		 this.playerSpeed = 0;
		 this.staticFriction = 1;
		 this.leftPush = false;
		 this.rigthPush = false;

		var pointer = this.input.activePointer;

		this.input.on('pointerdown', this.downAction, this);
		this.input.on('pointerup',this.upAction, this);
		this.input.on('pointermove',this.moveplayer,this);

		this.game.croquetView.addCroquetNetworkPlayer();
		this.game.croquetView.getSessionID();

		this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
		this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2);
		this.mySession =  null;
		this.fNetPLayers = [];

		this.keys = this.input.keyboard.addKeys('W,S,A,D'); 
		this.WASD_ObjDown = this.keys.isDown;
		this.WASD_ObjUp = this.keys.isUp;

		this.W_keyObj = this.input.keyboard.addKey('W');  // Get key object
		this.A_keyObj = this.input.keyboard.addKey('A');  // Get key object
		this.S_keyObj = this.input.keyboard.addKey('S');  // Get key object
		this.D_keyObj = this.input.keyboard.addKey('D');  // Get key object

	}


	getColor(){

				let color = [0xD24CBA,0xC03D4A,0x8AC03D,0x2EE5CB,0x2E9BE5,0xA949E6];
				let randomNumber = Math.ceil(Math.random()*5);
				let randomColor = color[randomNumber];
				return randomColor;
	}



	addPhaserNetworkPlayer(allPlayers){
		console.log('#JugadoreLocales ' + this.fMainPlayer.getLength());


		if(this.fMainPlayer.getLength()<=0){

	  		console.log('creando player');
			var randomColor =  this.getColor();
			let playerShape = this.add.graphics();
			playerShape.lineStyle(5, 0xFF00FF, 1.0);
			playerShape.fillStyle(randomColor, 1);
			playerShape.fillRect(0, 0, 100, 50);

			let PlayerTexture = playerShape.generateTexture('playerShape',100,50);
			playerShape.destroy();

			var player = this.physics.add.image(this.scale.width/2,this.scale.height/2,this.textures.get("playerShape"));
			player.setOrigin(0.6, 0.5);
			player.setCollideWorldBounds();

			this.fplayer = player; //jugador local

			this.fMainPlayer.add(player);
			this.mySession = this.game.croquetView.getSessionID();
			this.game.croquetView.confirmPlayerAdded(this.mySession);
   	  		this.cameras.main.startFollow(this.fplayer);

			if(allPlayers.length>0){

		//		this.game.croquetView.updatePlayerList();
			}
		}else {

		console.log('local player already created');
	}
	this.updatePos();
	return true;
	}

	addPhaserNetworkOnlinePlayer(allPlayers){

		console.log('--creando online players--');
		console.log('online players: ' + allPlayers);
		if(allPlayers.length>0){
			allPlayers.forEach((NetPlayer, i) => {
				console.log('id de NetPlayer -> ' + NetPlayer);
				console.log('mi session es -> ' + this.game.croquetView.getSessionID());
				if(NetPlayer != this.game.croquetView.getSessionID()){
					console.log('agrego todos los jugadores nuevos ' + NetPlayer);
					var player = this.physics.add.image(this.scale.width/2,this.scale.height/2,this.textures.get("playerShape"));
					player.setOrigin(0.6, 0.5);
						player.setCollideWorldBounds();
					var NetplayerObject = {NetPlayer:player,id:NetPlayer};
					this.fNetPLayers.push(NetplayerObject);
				}else{

					console.log('este jugador ya esta creado')
				}

			});
		}else {
			console.log('no hay jugadores online');
		}

  this.updatePos();
	this.game.croquetView.getPlayersPos();

	}

	updatePos(){

		var netData = {
			sessionId:this.mySession,
			xpos:this.fplayer.x,
			ypos:this.fplayer.y,
			xvelo:this.fplayer.body.velocity.x,
			yvelo:this.fplayer.body.velocity.y
		}

		this.game.croquetView.downActionMade(netData);

	}

	removePhaserNetworkPlayer(sessionId){


		console.log('nedd to remove ' + sessionId);

		this.fNetPLayers.forEach((NetplayerObject, i) => {
			console.log('iteracion id: ' + NetplayerObject);
			if(sessionId == NetplayerObject.id){
				console.log('removing ' + NetplayerObject.id);
					NetplayerObject.NetPlayer.destroy();
			}
		});

	}

	update() {

		this.W_isDown = this.W_keyObj.isDown;
		this.W_isUp = this.W_keyObj.isUp;
		
		this.A_isDown = this.A_keyObj.isDown;
		this.A_isUp = this.A_keyObj.isUp;

		this.S_isDown = this.S_keyObj.isDown;
		this.S_isUp = this.S_keyObj.isUp;

		this.D_isDown = this.D_keyObj.isDown;
		this.D_isUp = this.D_keyObj.isUp;


		if(typeof(this.fplayer) != "undefined"){
			

			if(this.W_isDown){
				
				this.currentSpeed = 500;

			}else if(this.S_isDown){

				this.currentSpeed = -300;

			}else{

		        if (Math.abs(this.currentSpeed) > 0)
		        {

		        	this.direction = Math.sign(this.currentSpeed)*-1;

		            this.currentSpeed += 10*this.direction;
		        }

		    }


			if(this.A_isDown){
				this.fplayer.rotation-=0.1;
			}else if(this.D_isDown){
				this.fplayer.rotation+=0.1;
			}


			if (Math.abs(this.currentSpeed) > 0)
		    {
		        this.physics.velocityFromRotation(this.fplayer.rotation, this.currentSpeed, this.fplayer.body.velocity);
		    }



		}	
	}

	printMessage(mensaje){
		this.fMensaje.setText(mensaje);
	}


	moveNetPhaserPlayer(data){

		this.fNetPLayers.forEach((NetplayerObject, i) => {

			if(data.sessionId == NetplayerObject.id){
		//console.log(data.sessionId + 'position is: ' + " x: " + data.xpos + " y: " + data.ypos + ' velox: ' + data.xvelo );
				NetplayerObject.NetPlayer.x = data.xpos;
				NetplayerObject.NetPlayer.y = data.ypos;
				NetplayerObject.NetPlayer.body.velocity.x = data.xvelo;
				NetplayerObject.NetPlayer.body.velocity.y = data.yvelo;
			}
		});

	}
	downAction(pointer){


			this.swipeCoordX = pointer.x;
			this.swipeCoordY = pointer.y;

			var netData = {
				sessionId:this.mySession,
				xpos:this.fplayer.x,
				ypos:this.fplayer.y,
				xvelo:this.fplayer.body.velocity.x,
				yvelo:this.fplayer.body.velocity.y
			}

			this.game.croquetView.downActionMade(netData);

	}

	upAction(pointer){

			this.swipeCoordX2 = pointer.x;
			this.swipeCoordY2 = pointer.y;

			this.powerY =  Math.abs(this.swipeCoordY2 - this.swipeCoordY);
			this.powerX =  Math.abs(this.swipeCoordX2 - this.swipeCoordX);
			this.directionY = Math.sign(this.swipeCoordY2 - this.swipeCoordY);
			this.directionX = Math.sign(this.swipeCoordX2 - this.swipeCoordX);

			this.fplayer.body.velocity.y = this.powerY*this.directionY;
			this.fplayer.body.velocity.x = this.powerX*this.directionX;


			var netData = {
				sessionId:this.mySession,
				xpos:this.fplayer.x,
				ypos:this.fplayer.y,
				xvelo:this.fplayer.body.velocity.x,
				yvelo:this.fplayer.body.velocity.y
			}

			this.game.croquetView.downActionMade(netData);


	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */


// You can write more code here
