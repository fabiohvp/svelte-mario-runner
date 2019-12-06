<script>
  import { createEventDispatcher } from "svelte";
  import images from "./images.js";

  const dispatch = createEventDispatcher();

  const ground = {
    ground: { path: "/assets/background/ground.jpg" },
    grass: { path: "/assets/background/grass.jpg" },
    mountain: { path: "/assets/background/mountain.jpg" }
  };

  export let canvas;
  export let height;
  export let obstacleHeight;
  export let tileSize;
  export let width;

  let groundWidth;
  let groundHeight;

  let context;
  let nextDrawTime = Date.now();
  let obstacleCount = 0;
  let obstaclesRef;
  let tiles = [];

  export async function init() {
    context = canvas.getContext("2d");
    await images.load(ground);
    groundHeight = ground.ground.image.height;
    groundWidth = ground.ground.image.width;

    context.fillStyle = "#6095ff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < width; i += groundWidth) {
      tiles.push(getNextGround());
    }
  }

  export function draw() {
    for (let i = 0; i < tiles.length; i++) {
      const x = i * groundWidth;
      const y = height - groundHeight;

      context.drawImage(tiles[i].ground, x, y);

      if (tiles[i].obstacle) {
        tiles[i].obstacle.style.left = x - tileSize + "px";
        tiles[i].obstacle.style.top = height - tileSize - obstacleHeight + "px";
        obstaclesRef.appendChild(tiles[i].obstacle);
      }
    }

    if (tiles[0].obstacle) {
      obstaclesRef.removeChild(tiles[0].obstacle);
    }
    tiles.shift();
    tiles.push(getNextGround());
    dispatch("slide", tiles);
  }

  function getNextGround() {
    const randObstacle = Math.floor(Math.random() * 20); //0-19
    let _obstacle = undefined;
    let _ground = ground.mountain.image;

    if (randObstacle > 13) {
      if (obstacleCount < 4) {
        obstacleCount++;
      } else {
        _obstacle = document.createElement("div");
        _obstacle.className = "obstacle";
        _obstacle.style.position = "absolute";
        _obstacle.style.width = tileSize + "px";
        _obstacle.style.height = obstacleHeight + "px";
        _obstacle.style.backgroundImage =
          'url("/assets/background/obstacle.png")';
        obstacleCount = 0;
      }
    }

    const randGround = Math.floor(Math.random() * 20); //0-19

    if (randGround < 13) {
      _ground = ground.ground.image;
    } else if (randGround < 17) {
      _ground = ground.grass.image;
    }
    return { ground: _ground, obstacle: _obstacle };
  }
</script>

<canvas bind:this={canvas} {width} {height} />
<div bind:this={obstaclesRef} />
