const box = document.getElementById('box');
const random_int = (max) => Math.floor(Math.random() * Math.floor(max));

const UP = [-1,0];
const DOWN =  [1,0];
const RIGHT = [0,1];
const LEFT = [0,-1];

const bound_x = 32;
const bound_y = 32;

const feed = (game) => {
  do {
    game.fx = random_int(bound_x);
    game.fy = random_int(bound_y);
  } while (game.field[game.fy][game.fx] !== 0)
  return game; // todo make immutable
};

const setup = () => {
  let game = {}
  game.field =  new Array(bound_y).fill(0).map(() => new Array(bound_x).fill(0));
  game.x = random_int(bound_x);
  game.y = random_int(bound_y);
  game.l = 2;
  game.d = UP;
  game.running = true;

  switch (random_int(4)) {
  case 0: game.d = UP; break;
  case 1: game.d = DOWN; break;
  case 2: game.d = LEFT; break;
  case 3: game.d = RIGHT; break;
  }

  for (let i = game.l; i > 0; i--) {
    game.field[game.y - (i * game.d[0])][game.x - (i * game.d[1])] = i;
  }
  return feed(game);
}

const draw = (game) => {
  box.innerHTML = "";
  for (var i = 0; i < bound_y; i++) {
    box.innerHTML += "<p>";
    for (var j = 0; j < bound_x; j++) {
      if (game.field[i][j] > 0)
        box.innerHTML += '+';
      else if (i === game.fx && j === game.fy)
        box.innerHTML += '0';
      else
        box.innerHTML += '.';
    }
    box.innerHTML += "</p>";
  }
}

const update_game = (game) => {
  nx = game.x + game.d[0]
  ny = game.y + game.d[1]
  if (nx >= bound_x || nx < 0 || ny >= bound_y || ny < 0 || game.field[nx][ny] > 0) {
    game.running = false;
  } else if (nx === game.fx && ny == game.fy) {
    game.l += 1;
    game.x = nx;
    game.y = ny;
    game.field[nx][ny] = game.l;
    feed(game);
  } else {
    game.x = nx;
    game.y = ny;
    for (var i = 0; i < bound_x; i++) {
      for (var j = 0; j < bound_y; j++) {
        game.field[i][j] = Math.max(0, game.field[i][j] - 1);
      }
    }
    game.field[game.x][game.y] = game.l;
  }
  return game; // todo make immutable
}

let game = setup();

document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {
    game.d = LEFT;
  } else if(event.keyCode == 38) {
    game.d = UP;
  } else if(event.keyCode == 39) {
    game.d = RIGHT;
  } else if(event.keyCode == 40) {
    game.d = DOWN;
  }
});

let tick = 0;
const update = () => {
  if (tick++ === 15) {
    tick = 0;
    game = update_game(game);
  }
}

/* Run loop */
let limit = 300;
let lastFrameTimeMs = 0;
let maxFPS = 60;
let delta = 0;
let timestep = 1000 / 60;
let fps = 60;
let framesThisSecond = 0;
let lastFpsUpdate = 0;

const panic = () => {}

const mainLoop = (timestamp) => {
  // Throttle the frame rate.
  if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
    requestAnimationFrame(mainLoop);
    return;
  }
  delta += timestamp - lastFrameTimeMs;
  lastFrameTimeMs = timestamp;

  if (timestamp > lastFpsUpdate + 1000) {
    fps = 0.25 * framesThisSecond + 0.75 * fps;

    lastFpsUpdate = timestamp;
    framesThisSecond = 0;
  }
  framesThisSecond++;

  let numUpdateSteps = 0;
  while (delta >= timestep) {
    update(game);
    delta -= timestep;
    if (++numUpdateSteps >= 240) {
      panic();
      break;
    }
  }
  draw(game);
  requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
