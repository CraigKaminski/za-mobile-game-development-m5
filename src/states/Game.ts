export class Game extends Phaser.State {
  private readonly PLAYER_SPEED = 200;
  private readonly BULLET_SPEED = -1000;
  private background: Phaser.TileSprite;

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
  }

  public update() {

  }
}
