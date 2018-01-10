export class Enemy extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private enemyBullets: number[];

  constructor(game: Phaser.Game, x: number, y: number, key: string, health: number, enemyBullets: number[]) {
    super(game, x, y, key);

    this.animations.add('getHit', [0, 1, 2, 1, 0], 25, false);
    this.anchor.setTo(0.5);
    this.health = health;

    this.enemyBullets = enemyBullets;
  }

  public update() {
    if (this.x < 0.05 * this.game.world.width) {
      this.x = 0.05 * this.game.world.width + 2;
      this.body.velocity.x *= -1;
    } else if (this.x > 0.95 * this.game.world.width) {
      this.x = 0.95 * this.game.world.width - 2;
      this.body.velocity.x *= -1;
    }

    if (this.top > this.game.world.height) {
      this.kill();
    }
  }

  public damage(amount: number): Phaser.Sprite {
    super.damage(amount);

    this.play('getHit');

    if (this.health <= 0) {
      const emitter = this.game.add.emitter(this.x, this.y, 100);
      emitter.makeParticles('enemyParticle');
      emitter.minParticleSpeed.setTo(-200);
      emitter.maxParticleSpeed.setTo(200);
      emitter.gravity.setTo(0);
      emitter.start(true, 500, undefined, 100);
    }

    return this;
  }
}
