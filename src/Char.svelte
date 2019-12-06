<script>
  import cssVars from "svelte-css-vars";
  import { onDestroy } from "svelte";

  export let tileSize;
  export let paused;

  let charRef;
  let jumping = false;
  let jumpingTimer;
  let walking = true;

  let styleVars = {
    jumpTime: ".3s"
  };

  onDestroy(() => {
    clearInterval(jumpingTimer);
  });

  export function walk() {
    jumping = false;
    walking = true;
  }

  export function jump() {
    jumping = true;
    walking = false;
    clearTimeout(jumpingTimer);
    jumpingTimer = setTimeout(walk, 500);
  }

  export function getPosition() {
    return charRef.getBoundingClientRect();
  }

  export function isJumping() {
    return jumping;
  }
</script>

<style>
  .char {
    background-image: url("/assets/character/mario2.png");
    background-position: 0 0;
    background-repeat: 0 0;
    width: 48px;
    height: 96px;
    position: absolute;
  }

  .jumping {
    transform-origin: 50% 50%;
    animation: jump var(--jumpTime) linear alternate infinite;
  }

  .walking {
    animation: char 0.5s steps(3) infinite;
  }

  .paused {
    animation: none !important;
  }

  @keyframes char {
    0% {
      background-position: 0px 0;
    }

    100% {
      background-position: 144px 0;
    }
  }

  @keyframes jump {
    0% {
      transform: translate3d(0, 0px, 0) scale3d(1, 1, 1);
    }
    50% {
      transform: translate3d(0, -60px, 0) scale3d(1, 1, 1);
    }
    100% {
      transform: translate3d(0, -120px, 0) scale3d(1, 1, 1);
    }
  }
</style>

<div
  bind:this={charRef}
  class="char"
  style="bottom:{tileSize}px"
  use:cssVars={styleVars}
  class:jumping
  class:walking
  class:paused />
