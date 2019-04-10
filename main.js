const box = document.getElementById('box');

const bound_x = 32;
const bound_y = 32;
var field =  new Array(bound_x).fill(0).map(() => new Array(bound_y).fill(0));

const random_int = (max) => Math.floor(Math.random() * Math.floor(max));

const UP = [-1,0];
const DOWN =  [1,0];
const RIGHT = [0,1];
const LEFT = [0,-1];

let x = random_int(bound_x);
let y = random_int(bound_y);
let l = 2;
let d = UP;
let fx = random_int(bound_x);
let fy = random_int(bound_y);
let running = true;


const feed = () => {
  while (field[fx][fy] !== 0) {
    fx = random_int(bound_x);
    fy = random_int(bound_y);
  }
};

const setup = () => {
  switch (random_int(4)) {
  case 0: d = UP; break;
  case 1: d = DOWN; break;
  case 2: d = LEFT; break;
  case 3: d = RIGHT; break;
  }

  for (let i = l; i > 0; i--) {
    field[x - (i * d[0])][y - (i * d[1])] = i;
  }
  feed();
}


const draw = () => {
  box.innerHTML = "";
  for (var i = 0; i < bound_x; i++) {
    box.innerHTML += "<p>";
    for (var j = 0; j < bound_y; j++) {
      if (field[i][j] > 0)
        box.innerHTML += '+';
      else if (i === fx && j === fy)
        box.innerHTML += '0';
      else
        box.innerHTML += '.';
    }
    box.innerHTML += "</p>";
  }
}


document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {
    d = LEFT;
  } else if(event.keyCode == 38) {
    d = UP;
  } else if(event.keyCode == 39) {
    d = RIGHT;
  } else if(event.keyCode == 40) {
    d = DOWN;
  }
});

let tick = 0;
const update = () => {
  tick++;
  if (tick === 30) {
    tick = 0;
    nx = x + d[0]
    ny = y + d[1]
    if (nx >= bound_x || nx < 0 || ny >= bound_y || ny < 0 || field[nx][ny] > 0) {
      running = false;
    } else if (nx === fx && ny == fy) {
      l += 1;
      x = nx;
      y = ny;
      field[nx][ny] = l;
      feed();
    } else {
      x = nx;
      y = ny;
      for (var i = 0; i < bound_x; i++) {
        for (var j = 0; j < bound_y; j++) {
          field[i][j] = Math.max(0, field[i][j] - 1);
        }
      }
      field[x][y] = l;
    }
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

const panic = () => {
  running = false;
}

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
        update(timestep);
        delta -= timestep;
        if (++numUpdateSteps >= 240) {
            panic();
            break;
        }
    }
    draw();
    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
