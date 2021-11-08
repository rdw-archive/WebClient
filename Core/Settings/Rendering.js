var RENDERER_FPS_UPDATE_INTERVAL_IN_FRAMES = 60; // One update per second isn't responsive, but accurate enough for now

// Used when the Renderer is first created
var RENDERER_USE_ANTIALIASING = true;
var RENDERER_USE_ALPHA = true;
var RENDERER_OPTIMIZE_SCENE_LOOKUP_OPERATIONS = true; // Memoize references to trade RAM usage for performance

// Fog properties
var RENDERER_FOG_MODE = Enum.FOG_MODE_LINEAR;
var RENDERER_FOG_MIN_DISTANCE = 150 / 10;
var RENDERER_FOG_NEAR_LIMIT = 1;
var RENDERER_FOG_MAX_DISTANCE = 1490 / 10;
var RENDERER_FOG_FAR_LIMIT = 1;
var RENDERER_FOG_DENSITY = 15;
var RENDERER_FOG_COLOR = Color.GREY;

// Debugging
var RENDERER_SHOW_COORDINATE_AXES = true;
var RENDERER_WIREFRAME_GEOMETRY = false;
var RENDERER_DEBUG_MESH_RENDERING_GROUP_ID = 5; // Should be higher than the scene geometry to avoid glitches

// Scene
var RENDERER_SCENE_BACKGROUND_COLOR = "#7B7BA5"; //"#0077FF"

// Sprite rendering
var RENDERER_NUM_SPRITE_DRAW_LAYERS = 10; // One per attachment type is required; Not sure how many are sensible?
const RENDERER_MAX_SIMULTANEOUS_SPRITES = 1024; // TBD: Does this murder performance if set too high?
var RENDERER_PIXELS_PER_WORLDUNIT = 32; // Used to calculate the proportions of sprites
const RENDERER_DEFAULT_UNIT_ANIMATION_INDEX = 0; // Should be the STAND (idle) animation
