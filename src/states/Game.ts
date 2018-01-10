import { Enemy } from '../prefabs/Enemy';
import { PlayerBullet } from '../prefabs/PlayerBullet';

export class Game extends Phaser.State {
  private readonly PLAYER_SPEED = 200;
  private readonly BULLET_SPEED = -1000;
  private background: Phaser.TileSprite;
  private enemies: Phaser.Group;
  private enemyBullets: Phaser.Group;
  private player: Phaser.Sprite;
  private playerBullets: Phaser.Group;
  private shootingTimer: Phaser.TimerEvent;

  public init() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.physics.startSystem(Phaser.Physics.ARCADE);
  }

  public preload() {
    this.load.image('space', 'images/space.png');
    this.load.image('player', 'images/player.png');
    this.load.image('bullet', 'images/bullet.png');
    this.load.image('enemyParticle', 'images/enemyParticle.png');
    this.load.spritesheet('yellowEnemy', 'images/yellow_enemy.png', 50, 46, 3, 1, 1);
    this.load.spritesheet('redEnemy', 'images/red_enemy.png', 50, 46, 3, 1, 1);
    this.load.spritesheet('greenEnemy', 'images/green_enemy.png', 50, 46, 3, 1, 1);
  }

  public create() {
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'space');
    this.background.autoScroll(0, 30);

    this.player = this.add.sprite(this.world.centerX, this.world.height - 50, 'player');
    this.player.anchor.setTo(0.5);
    this.physics.arcade.enable(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).collideWorldBounds = true;

    this.initBullets();
    this.shootingTimer = this.time.events.loop(Phaser.Timer.SECOND / 5, this.createPlayerBullet, this);

    this.initEnemies();
  }

  public update() {
    this.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, undefined, this);

    this.physics.arcade.overlap(this.enemyBullets, this.player, this.killPlayer, undefined, this);

    (this.player.body as Phaser.Physics.Arcade.Body).velocity.x = 0;

    if (this.input.activePointer.isDown) {
      const targetX = this.input.activePointer.position.x;

      const direction = targetX >= this.world.centerX ? 1 : -1;

      (this.player.body as Phaser.Physics.Arcade.Body).velocity.x = direction * this.PLAYER_SPEED;
    }
  }

  private initBullets() {
    this.playerBullets = this.add.group();
    this.playerBullets.enableBody = true;
  }

  private createPlayerBullet() {
    let bullet: PlayerBullet = this.playerBullets.getFirstExists(false);

    if (!bullet) {
      bullet = new PlayerBullet(this.game, this.player.x, this.player.top);
      this.playerBullets.add(bullet);
    } else {
      bullet.reset(this.player.x, this.player.top);
    }

    bullet.body.velocity.y = this.BULLET_SPEED;
  }

  private initEnemies() {
    this.enemies = this.add.group();
    this.enemies.enableBody = true;

    this.enemyBullets = this.add.group();
    this.enemyBullets.enableBody = true;

    const enemy = new Enemy(this.game, 100, 100, 'greenEnemy', 10, this.enemyBullets);
    this.enemies.add(enemy);

    enemy.body.velocity.x = 100;
    enemy.body.velocity.y = 50;
  }

  private damageEnemy(bullet: Phaser.Sprite, enemy: Phaser.Sprite) {
    enemy.damage(1);
    bullet.kill();
  }

  private killPlayer(bullet: Phaser.Sprite, player: Phaser.Sprite) {
    player.kill();
    bullet.kill();
    this.state.start('Game');
  }
}
