class HitList {
  // This is a map of all galaxies that have been found. 
  // Drones leave it within galaxies for other drones to find and continue their mission in a coordinated manner
  constructor() {
    this.hits = [];
  }

  add(x, y, name) {
    this.hits.push(
      {
        x: x,
        y: y,
        name: name,
      }
    )
  }
}

class Base {
  constructor(hitlist, name) {
    this.hitlist = hitlist ? hitlist : new HitList();
    this.drones = [];
    this.productionCount = 0;
    this.name = name;
  }

  findObjectInLine(startX, startY, angle, galaxies) {
    // this returns the name and minimum distance needed for a drone to travel to enter a galaxy

    // we can approach this problem by imagining a vector that spans x, y, to the edge of the map.
    // then using the const DRONE_DETECTION_RANGE, check if any galaxies are within it's radius
    // 

    // Convert angle to radians
    let radians = angle * (Math.PI / 180);
    let closestObject = null;
    let closestDistance = Infinity;

    galaxies.forEach(g => {
      const dx = startX - g.x;
      const dy = startY - g.y;
      const objectAngle = Math.atan2(dy, dx);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (Math.abs(radians - objectAngle) < 1) {
        if (distance < closestDistance) {
          closestObject = g;
          closestDistance = distance;
        }
      }
    });

    if (closestObject) { return { id: closestObject.id, distance: closestDistance } }
  }

  createDrone() {
    let drone = new Drone(this.hitlist);
    drone.name = this.name.toLowerCase() + "-" + (this.productionCount + 1);
    drone.id = drone.name;
    drone.x = this.x;
    drone.y = this.y;
    this.drones.push(drone);
    this.productionCount += 1;
  }

  createDrones(amount) {
    for (let i = 0; i < amount; i++) {
      this.createDrone()
    }
  }

  launchDrone(drone, angle) {
    // Remove drone from this factory and into intergalactic space
    console.log(drone.name + " launching from " + this.name + " at " + angle + "deg.")
    drone.speed = DRONE_VELOCITY;
    drone.angle = angle;

    let stopIndicator = this.findObjectInLine(this.x, this.y, angle, map.galaxies);

    if (stopIndicator) {
      drone.upcomingStopIndicator = stopIndicator.distance;
      drone.upcomingStopId = stopIndicator.id;
    }
    else {
      // drone lost to space
    }
    this.drones.splice(this.drones.indexOf(drone), 1);
    map.space.drones.push(drone);
  }

  launchAllDrones() {
    // Launch the drones from earth
    const initialDroneCount = map.home.drones.length
    for (let i = map.home.drones.length - 1; i >= 0; i--) {
      let drone = map.home.drones[i];
      const launch_angle = (360 / initialDroneCount) * i + 1;
      map.home.launchDrone(drone, launch_angle);
    }
  }
}

class Home {
  constructor(name) {
    this.x = width / 2
    this.y = height / 2
    this.name = name;
    this.hitlist = new HitList();
    this.base = new Base(this.hitlist, this.name);
    this.base.x = this.x
    this.base.y = this.y
  }
}

class Drone {
  constructor(hitlist) {
    this.x = 0;
    this.y = 0;
    this.hitlist = hitlist ? hitlist : new HitList();
    this.speed = 0;
    this.angle = 0.0;
    this.name = "";
    this.id = "";
    this.upcomingStopIndicator = 0;
    // stop indicator is a game variable so the drone knows when it has 
    // | reached a galaxy within it's range.
    this.upcomingStopId = undefined;
    this.thisTripTraveled = 0;
    // for tracking lightyears (lr) inbetween galaxies. resets after entering galaxy
    // if > stop indicator: land
    this.totalTraveled = 0;
  }

  constructBase(galaxyId) {
    let thisGalaxy = map.galaxies.find(galaxy => galaxy.id == galaxyId);
    let base = new Base(this.hitlist, thisGalaxy.name)
    thisGalaxy.base = base;
  }

  dock(baseId) {
    // for moving a drone into a base 
  }

  enterGalaxy(galaxyId) {

    // todo: update the hitlist before clearing the angle

    let thisGalaxy = map.galaxies.find(galaxy => galaxy.id == galaxyId);
    this.x = thisGalaxy.x
    this.y = thisGalaxy.y
    this.thisTripTraveled = 0;
    this.upcomingStopId = undefined;
    this.upcomingStopIndicator = 0;
    this.speed = 0;
    this.angle = 0;

    // todo: remove the drone from space

    thisGalaxy.drones.push(this);
  }

  update() {
    // const canEnterGalaxy = this.thisTripTraveled >= this.upcomingStopIndicator;
    const canEnterGalaxy = false; //temp for now
    
    // If the drone can enter a nearby galaxy, do so.
    if (canEnterGalaxy) {
      this.enterGalaxy(this.upcomingStopId);
    }
    // Otherwise, keep going deeper into space.
    else {
      const d = 5
      console.log(this.x)
      this.x =  this.x + d * Math.cos((Math.PI / 180) * this.angle)
      this.y =  this.y + d * Math.sin((Math.PI / 180) * this.angle)
      console.log(this.x)
    }

    // thoughts on the mechanism to interact with galaixes here:
    // i'm thinking there will be some temporary list generated when a 
    // drone is launched that finds the first galaxy within range of it's
    // detection range. if a galaxy is found, it's closest point of detection will
    // be stored in the drone's memory. upon updating, if the drone's current distance 
    // from it's launch point is greater than the predetermined value of the closest
    // galaxy, then the drone will move into the galaxy.
    // 
  }

}


class Space {
  constructor() {
    this.drones = [];
  }

  rollUnexpectedCrash() {
    return Math.random() < 0.01;
  }

  update() {
    // Check drone outcomes, like destruction, finding a galaxy,
    // entering in a galaxy.
    for (let i = this.drones.length - 1; i >= 0; i--) {
      let drone = this.drones[i];




      if (this.rollUnexpectedCrash()) {
        console.log("Drone " + drone.name + " has unexpectedly exploded during intergalactic voyage!")
        this.drones.splice(this.drones.indexOf(drone), 1);
      }
      else {
        drone.update();
      }

    }
  }
}


class Galaxy {
  constructor() {
    this.x = Math.round(Math.random() * width);
    this.y = Math.round(Math.random() * height);
    this.name = this.randomName();
    this.id = this.name.toLowerCase() + "-" + this.x;
    this.drones = [];
  }

  randomName() {
    GALAXY_NAMES = shuffleArray(GALAXY_NAMES);
    let pick = GALAXY_NAMES[0];
    GALAXY_NAMES.splice(0, 1)
    return pick;
  }

  update() {

  }
}



class Map {
  constructor(galaxyCount) {
    this.galaxies = this.generate(galaxyCount);
    this.space = new Space();
    this.home = new Base(new HitList(), "Earth");
    this.home.emoji = "🌎";
    this.home.x = width / 2;
    this.home.y = height / 2;
    this.backgroundMap = this.generateBackground();
  }

  generate(galaxyCount) {
    let temp_galaxies = []
    for (let i = 0; i < galaxyCount; i++) {
      temp_galaxies.push(new Galaxy());
    }
    return temp_galaxies
  }

  generateBackground() {
    let bg_map = []
    for (let i = 0; i < startCount; i++) {
      bg_map.push({ x: Math.random() * width, y: Math.random() * height })
    }
    return bg_map;
  }

  renderGalaxy(galaxy) {
    ctx.fillStyle = "white";
    ctx.fillText("🌌", galaxy.x, galaxy.y)
  }

  renderDrone(drone) {
    ctx.fillStyle = "white";
    ctx.fillText("🚀", drone.x, drone.y)
  }

  renderAll() {
    this.galaxies.forEach(galaxy => this.renderGalaxy(galaxy));
    this.space.drones.forEach(drone => this.renderDrone(drone));
  }

  renderBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "white";

    this.backgroundMap.forEach(star => {
      ctx.fillRect(star.y, star.x, starSize, starSize);
    })

  }

  renderHome() {
    ctx.font = '40px serif';
    ctx.fillText(this.home.emoji, this.home.x, this.home.y);
    ctx.font = default_font;
  }

  renderExploredGalaxies() {
    const explored = this.galaxies.filter(galaxy => galaxy.drones.length >= 1)
    explored.forEach(galaxy => this.renderGalaxy(galaxy));
  }

  renderDroneTrajectory(drone) {
    const startX = drone.x;
    const startY = drone.y;

    // Line length
    const length = 600;

    // Convert 180 degrees to radians
    const angleInRadians = drone.angle * (Math.PI / 180);

    // Calculate the end point
    const endX = startX + length * Math.cos(angleInRadians);
    const endY = startY + length * Math.sin(angleInRadians);
    console.log(startX, startY, endX, endY)
    // Draw the line
    // ctx.strokeStyle = '#FFFFFF';
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 10])
    ctx.beginPath();
    ctx.moveTo(startX, startY); // Move to start point
    ctx.lineTo(endX, endY); // Draw line to end point
    ctx.stroke(); // Apply stroke to render the line
  }

  updateAll() {
    // 1 - Update space (for interstellar drones)
    this.space.update();

    // 2 - Update galaxies
    this.galaxies.forEach(galaxy => {
      galaxy.update();
    });
  }

  update(steps=1) {
    for (let i = 0; i < steps; i++) {
      this.updateAll();
    }
    this.render();
  }

  render() {
    this.renderBackground();
    this.renderHome()
    this.renderExploredGalaxies();
    // 2. Re-render updated map.
    // Things like drawing the paths for drones before rendering 
    // discovered galaxies, then drones as tiny dots.
  }
}