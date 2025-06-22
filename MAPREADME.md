# Map Design Document

# Layers

colliison: tile
foreground: tile
background: tile
doors: object

The difference between doors and teleports is that doors spawn you in a new scene and teleports teleport you
around in the same scene. All door and teleport objects are in the doors layers of the map.

# Doors

The good things about doors is that you load a new scene so you can use the same ids on all triggers and spawns on bothsides of the door. So if we have door in Scene A that goes to door in Scene B, you will need a doorTrigger and doorSpawn in both scenes. The door id can be the same on all 4 total objects.

doorTrigger
    doorId: Id of the doorSpawn in scene B this door connects to
    scene: Name of the scene you want to load with this trigger
doorSpawn
    doorId: Id of the doorTrigger in scene A this door connects to

# Teleports

Teleports teletport the player around in the same scene. Similarly to doors, both sides of a teleport will need a 
teleportTrigger and teleportSpawn.

teleportTrigger:
    teleportId: teleportId of the teleportSpawn this trigger connects to
teleportSpawn:
    teleportId: teleportId of the teleportTrigger this spawn connects to