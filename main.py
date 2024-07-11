'''
# Rules

- TUI
- Grid coordinates


# Classes

- Drone
- Galaxy
- Home


# Flow

1. Home is initialized
2. Home launches x amount of drones in evenly spaced radius
3. Drone has x chance to crash in intergalactic travel
4. Once drone arrives in galaxy it checks for existing beacons containing other drone's path history and updates accordingly
5. The drone has found an unexplored galaxy
6. It begins the process of colonization
7. Once fully colonized it updates the beacon and begins manufacturing and launching more drones

*When all galaxies are colonized the game is won
*If there are no more drones the game is lost


# Info/Assumptions

- Earth maintains the same technological progress & outpost resources are reserved (meaning drones are only dispatched once)



'''

import random
import math


UNI_W = 20
GALAXY_SPAWN_CHANCE = .03


class Universe:
  def __init__(self):
    self.map = self.generate()
    
  
  def generateSpace():
    if random.uniform(0.0, 1.0) <= GALAXY_SPAWN_CHANCE:  return "galaxy"
    else: return "space"
    
    
  def generate(self):
    object_table = {
      "galaxy": "🌌",
      "space": " ",
      "earth": "🌎"
    }  
    
    map = [[object_table[Universe.generateSpace()] for __ in range(UNI_W + 1)] for _ in range(UNI_W + 1)]
    map[int(UNI_W / 2) + 1][int(UNI_W / 2) + 1] = object_table["earth"]
    # map[int(UNI_W / 2) + 1][int(UNI_W / 2) + 1:-1] = "." 
    
    return map
    
  def render(self):
    for y in range(len(self.map)):
      for x in range(len(self.map)):
        print(self.map[x][y], end=" ")
      print("\n")
  
  
  
class Drone:
  def __init__(self):
    pass
  
  def launch(self, coordinates):
    # Given coordinates it will traverse space to the coordinates
    pass
  
  
  
  
  
if __name__ == "__main__":
  uni = Universe()
  uni.render()
  # Universe.render()