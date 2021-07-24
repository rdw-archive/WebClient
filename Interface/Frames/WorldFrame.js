// This is a container for the canvas used to render the game world.
var WorldFrame = new Canvas("WorldFrame", ViewportContainer);
WorldFrame.enableMouse(true);
WorldFrame._obj.tabIndex = 2;
WorldFrame._obj.focus(); // tbd use ESC hierarchy to determine active frame (see WOW API)
