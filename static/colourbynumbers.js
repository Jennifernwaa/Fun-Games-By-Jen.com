const colourbynumbers = (p) => {
  let img;
  let gridSize = 16;
  let pixelGrid = [];
  let numberMap = [];
  let userPainting = [];
  let paletteColors = [];
  let currentColorIdx = 0;

  p.setup = () => {
    let canvas = p.createCanvas(600, 600);
    canvas.parent("color-game-container");
    p.noLoop();

    let input = p.createFileInput(handleFile);
    input.parent("color-game-container");

    p.createP("Select color to paint:").parent("color-game-container");
  };

  function handleFile(file) {
    if (file.type === 'image') {
      img = p.loadImage(file.data, () => {
        processImage(img);
      });
    }
    }

    function processImage(image) {
    image.resize(gridSize, gridSize);
    image.loadPixels();

    // Count color frequencies with tolerance
    let colorCounts = [];
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
        let idx = 4 * (x + y * image.width);
        let r = image.pixels[idx];
        let g = image.pixels[idx + 1];
        let b = image.pixels[idx + 2];
        let found = false;
        for (let entry of colorCounts) {
            let pc = entry.color;
            if (p.dist(p.red(pc), p.green(pc), p.blue(pc), r, g, b) < 30) {
            entry.count++;
            found = true;
            break;
            }
        }
        if (!found) {
            colorCounts.push({ color: p.color(r, g, b), count: 1 });
        }
        }
    }

    // Sort by frequency and pick top 10
    colorCounts.sort((a, b) => b.count - a.count);
    paletteColors = colorCounts.slice(0, 10).map(entry => entry.color);
    createPaletteButtons();

    // Assign each pixel to the closest palette color and build numberMap
    for (let y = 0; y < gridSize; y++) {
        pixelGrid[y] = [];
        numberMap[y] = [];
        userPainting[y] = [];
        for (let x = 0; x < gridSize; x++) {
        let idx = 4 * (x + y * image.width);
        let r = image.pixels[idx];
        let g = image.pixels[idx + 1];
        let b = image.pixels[idx + 2];
        let c = p.color(r, g, b);
        let closestIdx = 0;
        let closestDist = 1e9;
        for (let i = 0; i < paletteColors.length; i++) {
            let pc = paletteColors[i];
            let d = p.dist(p.red(pc), p.green(pc), p.blue(pc), r, g, b);
            if (d < closestDist) {
            closestDist = d;
            closestIdx = i;
            }
        }
        pixelGrid[y][x] = paletteColors[closestIdx];
        numberMap[y][x] = closestIdx;
        userPainting[y][x] = -1;
        }
    }
    p.redraw();
    }

  function createPaletteButtons() {
    // Remove old buttons if any
    let container = document.getElementById("color-game-container");
    let oldBtns = container.querySelectorAll(".palette-btn");
    oldBtns.forEach(btn => btn.remove());

    // Create new buttons for each palette color
    for (let i = 0; i < paletteColors.length; i++) {
      let btn = document.createElement("button");
      btn.className = "palette-btn";
      btn.style.background = p.color(paletteColors[i]).toString("#rrggbb");
      btn.style.width = "60px";
      btn.style.height = "60px";
      btn.style.margin = "2px";
      btn.innerText = `${i + 1}`;
      btn.onclick = () => { currentColorIdx = i; };
      container.appendChild(btn);
    }
  }

  p.draw = () => {
    p.background(255);
    let cellSize = p.width / gridSize;
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(cellSize * 0.4);
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        let px = x * cellSize;
        let py = y * cellSize;
        let painted = userPainting[y][x];
        p.stroke(200);
        if (painted >= 0) {
          p.fill(paletteColors[painted]);
        } else {
          p.fill(255);
        }
        p.rect(px, py, cellSize, cellSize);
        if (painted === -1 && paletteColors.length > 0) {
          p.fill(0);
          p.text(numberMap[y][x] + 1, px + cellSize / 2, py + cellSize / 2);
        }
      }
    }
  };

  p.mousePressed = () => {
    let cellSize = p.width / gridSize;
    let x = p.floor(p.mouseX / cellSize);
    let y = p.floor(p.mouseY / cellSize);
    if (
      x >= 0 && x < gridSize &&
      y >= 0 && y < gridSize &&
      paletteColors.length > 0
    ) {
      if (numberMap[y][x] === currentColorIdx) {
        userPainting[y][x] = currentColorIdx;
        p.redraw();
      }
    }
  };
};

new p5(colourbynumbers);