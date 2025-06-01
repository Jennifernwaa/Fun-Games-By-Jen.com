const sandgame = (p) => {
  let grid, velocityGrid;
  let w = 5, cols, rows;
  let hueValue = 100;
  let gravity = 0.1;

  function withinCols(i) {
    return i >= 0 && i <= cols - 1;
  }

  function withinRows(j) {
    return j >= 0 && j <= rows - 1;
  }

  function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  }

  p.setup = () => {
    let canvas = p.createCanvas(600, 700);
    canvas.parent("sand-game-container");
    p.colorMode(p.HSB, 360, 255, 255);
    cols = p.floor(p.width / w);
    rows = p.floor(p.height / w);
    grid = make2DArray(cols, rows);
    velocityGrid = make2DArray(cols, rows);
  };

  p.draw = () => {
    p.background(0);

    if (p.mouseIsPressed) {
      let mouseCol = p.floor(p.mouseX / w);
      let mouseRow = p.floor(p.mouseY / w);

      // Randomly add an area of sand particles
      let matrix = 5;
      let extent = p.floor(matrix / 2);
      for (let i = -extent; i <= extent; i++) {
        for (let j = -extent; j <= extent; j++) {
          if (p.random(1) < 0.75) {
            let col = mouseCol + i;
            let row = mouseRow + j;
            if (withinCols(col) && withinRows(row) && grid[col][row] === 0) {
              grid[col][row] = hueValue;
              velocityGrid[col][row] = 1;
            }
          }
        }
      }
      // Change the color of the sand over time
      hueValue += 0.5;
      if (hueValue > 360) {
        hueValue = 1;
      }
    }

    // Draw the sand
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        p.noStroke();
        if (grid[i][j] > 0) {
          p.fill(grid[i][j], 255, 255);
          let x = i * w;
          let y = j * w;
          p.square(x, y, w);
        }
      }
    }

    // Create a 2D array for the next frame of animation
    let nextGrid = make2DArray(cols, rows);
    let nextVelocityGrid = make2DArray(cols, rows);

    // Check every cell
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        let velocity = velocityGrid[i][j];
        let moved = false;
        if (state > 0) {
          let newPos = p.int(j + velocity);
          for (let y = newPos; y > j; y--) {
            let below = grid[i][y];
            let dir = 1;
            if (p.random(1) < 0.5) {
              dir *= -1;
            }
            let belowA = -1;
            let belowB = -1;
            if (withinCols(i + dir)) belowA = grid[i + dir][y];
            if (withinCols(i - dir)) belowB = grid[i - dir][y];

            if (below === 0) {
              nextGrid[i][y] = state;
              nextVelocityGrid[i][y] = velocity + gravity;
              moved = true;
              break;
            } else if (belowA === 0) {
              nextGrid[i + dir][y] = state;
              nextVelocityGrid[i + dir][y] = velocity + gravity;
              moved = true;
              break;
            } else if (belowB === 0) {
              nextGrid[i - dir][y] = state;
              nextVelocityGrid[i - dir][y] = velocity + gravity;
              moved = true;
              break;
            }
          }
        }

        if (state > 0 && !moved) {
          nextGrid[i][j] = grid[i][j];
          nextVelocityGrid[i][j] = velocityGrid[i][j] + gravity;
        }
      }
    }
    grid = nextGrid;
    velocityGrid = nextVelocityGrid;
  };
};

new p5(sandgame);