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
  
  6/25 - I have done some decent work on 
  drone and galaxy interactions. Now when they
  move into a galaxy their values change and
  the galaxy will be uncovered on next render.

  Next up to do is the fun stuff, math. I will 
  need to detemine the stopindicator stuff taking
  into account the signal range.

  Also long term note here, I think it would be 
  cool to have the drone's estimates of the optimal 
  path through dotted lines and watch how they 
  change over time with more drone coverage.


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
  7. 



*/

