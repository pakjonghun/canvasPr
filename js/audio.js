const shootAudio = new Howl({
  src: "./sound/Basic_shoot_noise.wav",
  volume: 0.1,
});

const damageAudio = new Howl({
  src: "./sound/Damage_taken.wav",
  volume: 0.1,
});

const explode = new Howl({
  src: "./sound/Missle_or_rpg_or_something_that_shoots_an_explosive.wav",
  volume: 0.1,
});

const death = new Howl({
  src: "./sound/Death.wav",
  volume: 0.1,
});

const powerUp = new Howl({
  src: "./sound/Powerup_noise.wav",
  volume: 0.1,
});

const select = new Howl({
  src: "./sound/Select.wav",
  volume: 0.1,
});

const background = new Howl({
  src: "./sound/Hyper.wav",
  volume: 0.1,
  loop: true,
});
