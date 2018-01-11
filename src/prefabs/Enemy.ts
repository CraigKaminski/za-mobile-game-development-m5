import { EnemyBullet } from './EnemyBullet';

export class Enemy extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private enemyBullets: Phaser.Group;
  private enemyTimer: Phaser.Timer;

  constructor(game: Phaser.Game, x: number, y: number, key: string, health: number, enemyBullets: Phaser.Group) {
    super(game, x, y, key);

    this.animations.add('getHit', [0, 1, 2, 1, 0], 25, false);
    this.anchor.setTo(0.5);
    this.health = health;

    this.enemyBullets = enemyBullets;

    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();

    this.scheduleShooting();
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

      this.enemyTimer.pause();
    }

    return this;
  }

  public reset(x: number,
               y: number,
               health: number,
               key?: string,
               scale?: number,
               speedX?: number,
               speedY?: number): Phaser.Sprite {
    super.reset(x, y, health);

    if (typeof key === 'string') {
      this.loadTexture(key);
    }

    if (typeof scale === 'number') {
      this.scale.setTo(scale);
    }

    if (typeof speedX === 'number') {
      this.body.velocity.x = speedX;
    }

    if (typeof speedY === 'number') {
      this.body.velocity.y = speedY;
    }

    this.enemyTimer.resume();

    return this;
  }

  private scheduleShooting() {
    this.shoot();

    this.enemyTimer.add(Phaser.Timer.SECOND * 2, this.scheduleShooting, this);
  }

  private shoot() {
    let bullet = this.enemyBullets.getFirstExists(false);

    if (!bullet) {
      bullet = new EnemyBullet(this.game, this.x, this.bottom);
      this.enemyBullets.add(bullet);
    } else {
      bullet.reset(this.x, this.bottom);
    }

    bullet.body.velocity.y = 100;
  }
}
