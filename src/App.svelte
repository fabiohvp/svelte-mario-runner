<script>
  import { onDestroy, onMount } from "svelte";
  import Char from "./Char.svelte";
  import Map from "./Map.svelte";
  import Sky from "./Sky.svelte";

  const interval = 3000;
  const maxLevel = 10;
  const height = 600;
  const obstacleHeight = 35;
  const tileSize = 46;
  const width = 800;

  let canvasRef;
  let char;
  let level = 1;
  let levelTimer;
  let lost = false;
  let map;
  let musicEnabled = true;
  let musicRef;
  let nextDrawTime = Date.now();
  let paused = true;
  let sky;
  let won = false;

  $: fps = 1000 / (level + 5);

  onMount(async () => {
    await map.init();
    await sky.init();
    map.draw();
    animate();

    levelTimer = setInterval(() => {
      if (!paused) {
        level++;
        musicRef.playbackRate += 0.1;

        if (level >= maxLevel) {
          won = true;
          if (musicEnabled) {
            musicRef.src = "/assets/music/won.mp3";
          }
        }
      }
    }, interval);
  });

  onDestroy(() => {
    clearInterval(levelTimer);
  });

  function animate() {
    if (!paused) {
      // request another frame
      requestAnimationFrame(animate);
      // calc elapsed time since last loop
      const now = Date.now();
      const elapsed = now - nextDrawTime;

      // if enough time has elapsed, draw the next frame
      if (elapsed > fps) {
        // Get ready for next frame by setting nextDrawTime=now, but also adjust for your
        // specified fps not being a multiple of RAF's interval (16.7ms)
        nextDrawTime = now - (elapsed % fps);
        map.draw();
      }
    }
  }

  function onKeypress(e) {
    if (!char.isJumping()) {
      if (e.which === 13) {
        if (lost || won) {
          won = false;
          lost = false;
          level = 1;
        }

        paused = !paused;

        if (paused) {
          musicRef.pause();
        } else {
          musicRef.src = "/assets/music/music.mp3";
        }
        animate();
      } else if (e.which === 32) {
        char.jump();
      }
    }
  }

  function onMapSlide(e) {
    const charPosition = char.getPosition();
    const tile = e.detail[1];

    if (tile.obstacle) {
      const obstaclePosition = parseInt(
        tile.obstacle.style.top.replace("px", "")
      );

      if (charPosition.top > 400) {
        lost = true;

        if (musicEnabled) {
          musicRef.src = "/assets/music/lost.mp3";
        }
      }
    }
  }

  function onToggleMusic(enable) {
    musicEnabled = enable;
    if (musicEnabled) {
      !paused && musicRef.play();
    } else {
      musicRef.pause();
    }
  }

  $: if (lost || won) {
    paused = true;
    musicRef.playbackRate = 1;
  }
</script>

<style>
  .canvas {
    position: relative;
  }

  .finished {
    display: block !important;
  }

  .hide {
    display: none;
  }

  .level {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px 10px;
    color: black;
    font-size: 1.5em;
    text-align: right;
  }

  .status {
    font-size: 4em;
    font-weight: bold;
    top: 30%;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
    display: none;
  }
</style>

<svelte:head>
  <title>Mario runner</title>
</svelte:head>

<svelte:window on:keypress={onKeypress} />

<div class="canvas" style="height:{height}px;width:{width}px">
  <div class="level">Level: {level}</div>
  <Sky bind:this={sky} bind:canvas={canvasRef} {width} {height} />
  <Map
    bind:this={map}
    bind:canvas={canvasRef}
    {width}
    {height}
    {obstacleHeight}
    {tileSize}
    on:slide={onMapSlide} />
  <div style="margin-left:{tileSize}px">
    <Char bind:this={char} {tileSize} {paused} />
  </div>
  <div class="status {lost || won ? 'finished' : ''}">
    Você {lost ? 'perdeu' : 'ganhou'}
  </div>
  <audio bind:this={musicRef} autoplay="false" />
</div>
<div>
  <span>
    Música
    <button class:hide={musicEnabled} on:click={() => onToggleMusic(true)}>
      On
    </button>
    <button class:hide={!musicEnabled} on:click={() => onToggleMusic(false)}>
      Off
    </button>
  </span>
  <br />
  <strong>Controles</strong>
  <br />
  <span>Pressione enter para começar</span>
  <br />
  <span>Pular: espaço</span>
  <br />
  <span>Pausar/despausar: enter</span>
</div>
