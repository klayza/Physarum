const dpr = window.devicePixelRatio || 1;

let canvas = document.querySelector("#map");
canvas.width = screen.width * dpr;
canvas.height = screen.width * dpr;

let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let starSize = 1;
let startCount = 10000;
let default_font = '20px serif';
const GALAXY_COUNT = 100;

ctx.scale(dpr, dpr);
ctx.font = default_font;

function revealGalaxy(galaxy) {
  ctx.fillStyle = "white";
  ctx.fillText("🌌", galaxy.x, galaxy.y)
}

function revealMap(map) {
  map.galaxies.forEach(galaxy => revealGalaxy(galaxy));
}

function findClosestRelativeTo(startObject, objects) {
  let x = startObject.x;
  let y = startObject.y;
  closest = objects[objects.length - 1]
  closest.xdistance = Math.abs(x - objects[objects.length - 1].x)
  closest.ydistance = Math.abs(y - objects[objects.length - 1].y)
  closest.totalDistance = closest.xdistance + closest.ydistance

  objects.forEach(obj => {
    const xdistance = Math.abs(x - obj.x);
    const ydistance = Math.abs(y - obj.y);
    const totalDistance = xdistance + ydistance;
    if (totalDistance < closest.totalDistance && totalDistance != 0) {
      closest = obj;
      closest.totalDistance = totalDistance;
    }
  });

  return closest;
}

function findObjectInLine(x, y, deg, objects) {
  const radians = deg * (Math.PI / 180);
  objects.forEach(obj => {

    // Instructuons:
    // Create a unit vector (list) for all points from the origin to the edge of the map
    // This list can be generated using sin and cos I think
    // Then check if any of the objects distance are < drone.signal_range amount 
    // And if there are multiple points in a line you must choose the one that is less distance to origin.

  });

  return closestObject ? closestObject : null;
}


const START_DRONES = 100;
const DRONE_VELOCITY = .1 // of the speed of light 
const DRONE_DETECTION_RANGE = 100 // thousands of light years
let map = new Map(GALAXY_COUNT);
map.render();
map.home.createDrones(START_DRONES);
map.home.launchAllDrones();
map.update(1);
// Game loop
// while (true) {
  // map.update(1);
  // map.render();
  // wait 1 sec
// }



/*
  Notes:
  
  7/11 - I have implemented the trajectory after
  learning a little bit about radians. so now they
  can keep moving if you update them. I still need to
  calculate the distance from the speed because I think
  it would be cool to vary speeds and see what changes.

  next to do is to render drones, calc distance, 
  and fix stop indicator calc.




  ## High level overview
  
  1. The map is initialized and drones are launched
  in various directions
  2. The drones will secretly predetermine their
  destinations, all that's left to do is let the game
  pass
  3. A drone finds a galaxy!
  4. It enters, creates a hitlist beacon for other 
  passing drones to find, and begins it's work
  5. Some time is required to construct a base and 
  start manufacturing more drones to send out
  6. Once the founder drone is done, it continues
  it's voyage in a new direction
  7. Another stray drone comes across a colonized galaxy!
  8. It exchanges findings with the beacon, and adjusts
  it's strategy.
  9. Once any hitlist contains all present galaxies, 
  the game is over!

*/

