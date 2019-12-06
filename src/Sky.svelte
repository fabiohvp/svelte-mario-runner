<script>
  import images from "./images.js";

  const cloud = {
    single: { path: "/assets/background/cloud-single.png" },
    multiple: { path: "/assets/background/cloud-multiple.png" }
  };

  export let canvas;
  export let height;
  export let width;

  export async function init() {
    await images.load(cloud);
    let context = canvas.getContext("2d");
    const numberOfClouds = getRandom(5, 15);
    let i = 0;

    while (i < numberOfClouds) {
      const randWidth = getRandom(0, width - cloud.single.image.width * 2);

      if (randWidth < width) {
        const randHeight = getRandom(0, height / 2);

        if (randHeight % 2 === 0) {
          context.drawImage(cloud.single.image, randWidth, randHeight);
        } else {
          context.drawImage(cloud.multiple.image, randWidth, randHeight);
        }
        i++;
      }
    }
  }

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
</script>

<style>
  .sky {
    position: absolute;
  }
</style>

<div class="sky" />
