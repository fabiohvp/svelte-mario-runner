async function load(images) {
  const promises = [];
  Object.keys(images).forEach(key => {
    promises.push(loadSingle(images[key]));
  });

  await Promise.all(promises);
}

function loadSingle(image) {
  const promise = new Promise((resolve, reject) => {
    image.image = new Image();
    image.image.src = image.path;
    image.image.onload = () => {
      resolve();
    };
  });

  return promise;
}

export default {
  loadSingle,
  load
};
