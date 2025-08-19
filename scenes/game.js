export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  init() {
  }

  preload() {
    this.load.image("sky", "public/assets/space3.png");
  }

  create() {
    this.add.image(400, 300, "sky");

    const W = this.scale.width;
    const H = this.scale.height;

    // Pala
    {
      const pala = this.add.graphics();
      pala.fillStyle(0xffffff, 1);
      pala.fillRect(0, 0, 100, 16);
      pala.generateTexture("paddle", 100, 16);
      pala.destroy();
    }
    // Pelota
    {
      const r = 7; // radio
      const pelota = this.add.graphics();
      pelota.fillStyle(0xff0000, 1);
      pelota.fillCircle(r, r, r);
      pelota.generateTexture("ball", r * 2, r * 2);
      pelota.destroy();
    }
    // Ladrillo)
    {
      const ladrillo = this.add.graphics();
      ladrillo.fillStyle(0x0000ff, 1);
      ladrillo.fillRect(0, 0, 120, 30);
      ladrillo.generateTexture("brick", 120, 30);
      ladrillo.destroy();
    }

    // ====== FÍSICA ======
    
    // Rebote
    this.physics.world.setBoundsCollision(true, true, true, true);

    // Pala
    this.pala = this.physics.add.staticImage(W * 0.5, H - 40, "paddle");

    // Pelota
    this.pelota = this.physics.add.image(W * 0.5, H * 0.5, "ball");
    this.pelota.setCollideWorldBounds(true);
    this.pelota.setBounce(1, 1);
    this.pelota.setCircle(7);

    // Velocidad inicial
    this.pelota.setVelocity(180, -220);

    // Ladrillo
    this.ladrillo = this.physics.add.staticImage(W * 0.65, H * 0.45, "brick");

    // Colisiones
    this.physics.add.collider(this.pelota, this.pala, this.hitPaddle, null, this);
    this.physics.add.collider(this.pelota, this.ladrillo, this.hitBrick, null, this);

    // Detectar si la pelota toca el borde inferior
    this.pelota.body.onWorldBounds = true;
    this.physics.world.on('worldbounds', (body, up, down, left, right) => {
      if (body.gameObject === this.pelota && down) {
        this.hitBottom(this.pelota);
      }
    });

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();

    // Velocidad de la pala (pixeles por segundo)
    this.paddleSpeed = 420;
  }

  update(time, delta) {
    // Mover pala con flechas (izq/der)
    const dt = delta / 1000;
    let dx = 0;
    if (this.cursors.left.isDown) dx = -this.paddleSpeed * dt;
    else if (this.cursors.right.isDown) dx = this.paddleSpeed * dt;

    // Actualizar X y limitar a los bordes
    const half = this.pala.width * 0.5;
    let newX = Phaser.Math.Clamp(this.pala.x + dx, half, this.scale.width - half);
    if (newX !== this.pala.x) {
      this.pala.setX(newX);
      this.pala.refreshBody();
    }
  }
  // Destruir el obstáculo al colisionar
  hitBrick(pelota, ladrillo) {
    ladrillo.disableBody(true, true);
  }
 
  hitBottom(pelota) {
    this.scene.restart();
  }
}