export class EnemyBullet extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;

  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y, 'bullet');

    this.anchor.setTo(0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
  }
}
