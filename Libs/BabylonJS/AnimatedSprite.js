// TODO: Separate animation (cellref, visibility, rotation, color) from position of the mesh?
// Note: The console.log calls during animation updates help with debugging visual glitches, since the chrome debugger doesn't do a great job at capturing async calls... but make sure to disable them afterwards or they will cause severe FPS drops
// TODO: Take from global Lua state


// This is the order in which the directions appear in the animations[animationIndex] array
// TODO: Super awkward and needs streamlining
let faceDirectionIndices = [
	LE_DIRECTION_SOUTH,
	LE_DIRECTION_SOUTHWEST,
	LE_DIRECTION_WEST,
	LE_DIRECTION_NORTHWEST,
	LE_DIRECTION_NORTH,
	LE_DIRECTION_NORTHEAST,
	LE_DIRECTION_EAST,
	LE_DIRECTION_SOUTHEAST,
];

const RENDERER_DEFAULT_UNIT_FACE_DIRECTION = LE_DIRECTION_SOUTH;

// Upvalues
let cameraDirection;
let worldMatrix;
let Vector3 = BABYLON.Vector3;
let VECTOR3_AXIS_U = new Vector3(1, 0, 0);
let VECTOR3_AXIS_V = new Vector3(0, 1, 0);

let relativeFaceDirections = {
	[LE_DIRECTION_SOUTH]: {
		[LE_DIRECTION_SOUTH]: LE_DIRECTION_NORTH,
		[LE_DIRECTION_SOUTHWEST]: LE_DIRECTION_NORTHWEST,
		[LE_DIRECTION_WEST]: LE_DIRECTION_WEST,
		[LE_DIRECTION_NORTHWEST]: LE_DIRECTION_SOUTHWEST,
		[LE_DIRECTION_NORTH]: LE_DIRECTION_SOUTH,
		[LE_DIRECTION_NORTHEAST]: LE_DIRECTION_SOUTHEAST,
		[LE_DIRECTION_EAST]: LE_DIRECTION_EAST,
		[LE_DIRECTION_SOUTHEAST]: LE_DIRECTION_NORTHEAST,
	},
	// TODO: Needs more testing once debug menu has UnitOptions
	[LE_DIRECTION_SOUTHWEST]: {
		[LE_DIRECTION_SOUTH]: LE_DIRECTION_NORTHEAST,
		[LE_DIRECTION_SOUTHWEST]: LE_DIRECTION_NORTH,
		[LE_DIRECTION_WEST]: LE_DIRECTION_NORTHWEST,
		[LE_DIRECTION_NORTHWEST]: LE_DIRECTION_WEST,
		[LE_DIRECTION_NORTH]: LE_DIRECTION_SOUTHWEST,
		[LE_DIRECTION_NORTHEAST]: LE_DIRECTION_SOUTH,
		[LE_DIRECTION_EAST]: LE_DIRECTION_SOUTHEAST,
		[LE_DIRECTION_SOUTHEAST]: LE_DIRECTION_EAST,
	},
	[LE_DIRECTION_WEST]: {
		[LE_DIRECTION_SOUTH]: LE_DIRECTION_EAST,
		[LE_DIRECTION_SOUTHWEST]: LE_DIRECTION_NORTHEAST,
		[LE_DIRECTION_WEST]: LE_DIRECTION_NORTH,
		[LE_DIRECTION_NORTHWEST]: LE_DIRECTION_NORTHWEST,
		[LE_DIRECTION_NORTH]: LE_DIRECTION_WEST,
		[LE_DIRECTION_NORTHEAST]: LE_DIRECTION_SOUTHWEST,
		[LE_DIRECTION_EAST]: LE_DIRECTION_SOUTH,
		[LE_DIRECTION_SOUTHEAST]: LE_DIRECTION_SOUTHEAST,
	},
	[LE_DIRECTION_NORTHWEST]: {
		[LE_DIRECTION_SOUTH]: LE_DIRECTION_SOUTHEAST,
		[LE_DIRECTION_SOUTHWEST]: LE_DIRECTION_EAST,
		[LE_DIRECTION_WEST]: LE_DIRECTION_NORTHEAST,
		[LE_DIRECTION_NORTHWEST]: LE_DIRECTION_NORTH,
		[LE_DIRECTION_NORTH]: LE_DIRECTION_NORTHWEST,
		[LE_DIRECTION_NORTHEAST]: LE_DIRECTION_WEST,
		[LE_DIRECTION_EAST]: LE_DIRECTION_SOUTHWEST,
		[LE_DIRECTION_SOUTHEAST]: LE_DIRECTION_SOUTH,
	},
	[LE_DIRECTION_NORTH]: {
		[LE_DIRECTION_SOUTH]: LE_DIRECTION_SOUTH,
		[LE_DIRECTION_SOUTHWEST]: LE_DIRECTION_SOUTHEAST,
		[LE_DIRECTION_WEST]: LE_DIRECTION_EAST,
		[LE_DIRECTION_NORTHWEST]: LE_DIRECTION_NORTHEAST,
		[LE_DIRECTION_NORTH]: LE_DIRECTION_NORTH,
		[LE_DIRECTION_NORTHEAST]: LE_DIRECTION_NORTHWEST,
		[LE_DIRECTION_EAST]: LE_DIRECTION_WEST,
		[LE_DIRECTION_SOUTHEAST]: LE_DIRECTION_SOUTHWEST,
	},
	[LE_DIRECTION_NORTHEAST]: {
		[LE_DIRECTION_SOUTH]: LE_DIRECTION_SOUTHWEST,
		[LE_DIRECTION_SOUTHWEST]: LE_DIRECTION_SOUTH,
		[LE_DIRECTION_WEST]: LE_DIRECTION_SOUTHEAST,
		[LE_DIRECTION_NORTHWEST]: LE_DIRECTION_EAST,
		[LE_DIRECTION_NORTH]: LE_DIRECTION_NORTHEAST,
		[LE_DIRECTION_NORTHEAST]: LE_DIRECTION_NORTH,
		[LE_DIRECTION_EAST]: LE_DIRECTION_NORTHWEST,
		[LE_DIRECTION_SOUTHEAST]: LE_DIRECTION_WEST,
	},
	[LE_DIRECTION_EAST]: {
		[LE_DIRECTION_SOUTH]: LE_DIRECTION_WEST,
		[LE_DIRECTION_SOUTHWEST]: LE_DIRECTION_SOUTHWEST,
		[LE_DIRECTION_WEST]: LE_DIRECTION_SOUTH,
		[LE_DIRECTION_NORTHWEST]: LE_DIRECTION_SOUTHEAST,
		[LE_DIRECTION_NORTH]: LE_DIRECTION_EAST,
		[LE_DIRECTION_NORTHEAST]: LE_DIRECTION_NORTHEAST,
		[LE_DIRECTION_EAST]: LE_DIRECTION_NORTH,
		[LE_DIRECTION_SOUTHEAST]: LE_DIRECTION_NORTHWEST,
	},
	[LE_DIRECTION_SOUTHEAST]: {
		[LE_DIRECTION_SOUTH]: LE_DIRECTION_NORTHWEST,
		[LE_DIRECTION_SOUTHWEST]: LE_DIRECTION_WEST,
		[LE_DIRECTION_WEST]: LE_DIRECTION_SOUTHWEST,
		[LE_DIRECTION_NORTHWEST]: LE_DIRECTION_SOUTH,
		[LE_DIRECTION_NORTH]: LE_DIRECTION_SOUTHEAST,
		[LE_DIRECTION_NORTHEAST]: LE_DIRECTION_EAST,
		[LE_DIRECTION_EAST]: LE_DIRECTION_NORTHEAST,
		[LE_DIRECTION_SOUTHEAST]: LE_DIRECTION_NORTH,
	},
};

// Represents a collection of sprites, organized in layers, and representing a single entity in the game world.
class AnimatedSprite {
	constructor(animationData, spriteManager, name, drawLayer, scene) {
		this.animationData = animationData;
		this.spriteManager = spriteManager;
		this.name = name;
		// this.drawLayer = drawLayer;
		this.animationSpeedPercent = 100;
		this.worldX = 0;
		this.worldY = 0;
		this.worldZ = 0;

		this.animationIndex = RENDERER_DEFAULT_UNIT_ANIMATION_INDEX;
		this.faceDirection = RENDERER_DEFAULT_UNIT_FACE_DIRECTION;
		this.currentFrameIndex = 0;
		this.frameCount = 0;
		this.isLooping = true; // since the default animation is idle, anything else looks weird
		this.isStatic = false;
		this.frameIndexOverrides = {};

		// Awkward, but the BJS observer doesn't pass it as argument
		let thisSprite = this;
		this.createLayers();
		function updateSpritePosition() {
			if (thisSprite.isAnimationFinished) {
				thisSprite.isAnimationFinished = false; // will be set again once all active layers finished to queue a new update
				thisSprite.animateNextFrame();
			}

			if (thisSprite.anchor !== undefined)
				thisSprite.currentFrameIndex =
					thisSprite.anchor.currentFrameIndex; // TODO: No need to actually animate this separately, then? (and remove the other fixes?)
			// TODO Does not take into account look direction?
			if (thisSprite.useCorrectionOffsets) {
				thisSprite.applyCorrectionOffsets();
				// console.log(
				// 	"Using correction offsets " +
				// 		thisSprite.finalCorrectionU +
				// 		" " +
				// 		thisSprite.finalCorrectionV
				// );
			}

			if (thisSprite.hasVisualizationPlanes)
				thisSprite.updateVisualizationPlanes();

			thisSprite.updatePositionForAllLayers(); // TODO Not needed, done before every frame  anyway
			// thisSprite.UpdateSpritePositions(); -- Serious slowdown. Is it actually needed? It should sync head/body etc. but calling it for monsters seems wasteful (and doing this in JS would be 30% faster?) // TODO Move to JS, we don't want the overhead but we do need syncing
			// TODO There are some poses we don't actually need to aniamte (STAND/SIT/FREEZE1,2), maybe we can make them static and save onAnimationFinished calls? However that depends on the actual pose/only works for players
		}

		this.unregisterUpdateFunction = function () {
			scene.unregisterBeforeRender(updateSpritePosition);
		};

		scene.registerBeforeRender(updateSpritePosition);
		// scene.registerBeforeRender(this.updateLayers)
		this.scene = scene;

		this.setDrawLayer(drawLayer); // Hacky: Affects ALL thiss using the same sprite manager...

		this.validateDimensions();

		this.isAnimationFinished = false; // set to true to enable layer updates before the next frame is rendered. Do not do it async or BJS will glitch out

		return this;
	}

	getAnchorCorrectionOffsets(attachmentFrameId) {
		let bodySprite = this.anchor;

		let frame = bodySprite.getFrame(attachmentFrameId);
		let anchorPoints = frame.anchorPoints;
		let bodyAttachmentOffset = anchorPoints[0];

		return bodyAttachmentOffset;
	}

	applyCorrectionOffsets() {
		// TODO Fixed animations do not use offsets?

		// if (!this.useCorrectionOffsets || this.isStatic) return; // duplicate checks?
		let attachmentFrameId = this.currentFrameIndex;
		if (this.correctionFrameOverride !== undefined)
			attachmentFrameId = this.correctionFrameOverride; // only 0 can be the value?

		let activeFrame = this.getActiveFrame();
		let currentAttachmentOffsets = this.getCorrectionOffsets();
		let currentAttachmentOffsetU = currentAttachmentOffsets.correctionU;
		let currentAttachmentOffsetV = currentAttachmentOffsets.correctionV;
		let relativeFaceDirection = this.getRelativeFaceDirection();
		// let currentAttachmentOffset = activeFrame.anchorPoints[0]; // significance of 0 == BODY?

		if(!this.animationData[this.animationIndex][
			relativeFaceDirection
		].frames[attachmentFrameId]) return;

		let currentAttachmentOffset = this.animationData[this.animationIndex][
			relativeFaceDirection
		].frames[attachmentFrameId].anchorPoints[0] || {
			correctionU: 0,
			correctionV: 0,
		}; // use 0 by default IF there are no anchor points only (TODO: Shift responsibility to converter?)

		let anchorCorrectionOffsets = this.getAnchorCorrectionOffsets(
			attachmentFrameId
		);
		this.anchorPointOffsetU = anchorCorrectionOffsets.correctionU;
		this.anchorPointOffsetV = anchorCorrectionOffsets.correctionV;

		let finalCorrectionU =
			this.anchorPointOffsetU - currentAttachmentOffset.correctionU;
		let finalCorrectionV =
			this.anchorPointOffsetV - currentAttachmentOffset.correctionV;

		if (
			!this.animationData[this.animationIndex][relativeFaceDirection]
				.frames[attachmentFrameId].anchorPoints[0]
		) {
			// Ignore anchoring?
			// console.log("IGNORING ANCHORS");
			finalCorrectionU = 0;
			finalCorrectionV = 0;
		}

		this.setFinalCorrectionOffsets(finalCorrectionU, finalCorrectionV);

		// local bodyAttachmentOffset = self:GetBodyAttachmentOffset(attachmentFrameId)
		// if attachment:IsStatic() then -- do not apply to shadow sprite?
		// 	attachment.obj.useCorrectionOffsets = false
		// 	return
		// end
		// -- Only applies for HEAD sprites?? (because lookDirection is the frame Index)
		// attachment.obj.useCorrectionOffsets = true
		// local activeFrame = attachment:GetActiveFrame()
		// local currentAttachmentOffsetU, currentAttachmentOffsetV = attachment:GetCorrectionOffsets()
		// local relativeFaceDirection = attachment:GetRelativeFaceDirection()
		// local currentAttachmentOffset = activeFrame.anchorPoints["0"]

		// currentAttachmentOffset =
		// 	attachment.obj.animationData[self.animationIndex][relativeFaceDirection].frames[attachmentFrameId].anchorPoints["0"]
		// -- always body, and look dir = only used for the head?? why is it applied to ALL attachments?

		// local finalCorrectionU = bodyAttachmentOffset.correctionU - currentAttachmentOffset.correctionU
		// local finalCorrectionV = bodyAttachmentOffset.correctionV - currentAttachmentOffset.correctionV

		// attachment:SetFinalCorrectionOffsets(finalCorrectionU, finalCorrectionV)
	}

	setDrawLayer(drawLayer) {
		this.drawLayer = drawLayer;
		this.spriteManager.renderingGroupId = drawLayer;
	}

	getAnimationCount() {
		return this.animationData.length;
	}
	startAnimating(animationIndex, isLooping) {
		if (animationIndex > this.getAnimationCount()) {
			throw new Error(
				"Failed to start animation for index " +
					animationIndex +
					"(no animation data exists)"
			);
		}

		this.stopAnimating();
		this.animationIndex = animationIndex;
		this.currentFrameIndex = 0; // Always reset/cancel the old animation, the new one should start at the beginning
		// Update layer visibility also? Maybe hide all,) { reactivate during updateLayers?
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			layer.isAnimating = true;
		}
		this.isAnimating = true;

		if (isLooping !== undefined) {
			this.isLooping = isLooping;
		}
		this.updateLayers();
	}
	resumeAnimating() {
		if (this.isAnimating) {
			return;
		}
		this.startAnimating(this.animationIndex, this.isLooping);
	}
	pauseAnimating() {
		this.isAnimating = false;
	}
	// TODO: Alias dispose() for consistency (BJS style)
	destroy() {
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			layer.sprite.stopAnimation(); // TODO needed?
			layer.sprite.dispose();
		}
		this.unregisterUpdateFunction();
		this.removeAnchors();
	}
	setWorldPosition(worldX, worldY, worldZ) {
		this.worldX = worldX;
		this.worldY = worldY;
		this.worldZ = worldZ;
	}
	stopAnimating() {
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			layer.sprite.stopAnimation();
			layer.isAnimating = false;
		}
	}
	createLayers() {
		let numRequiredLayers = this.getLayerCount();
		this.layers = [];

		for (let layerIndex = 0; layerIndex < numRequiredLayers; layerIndex++) {
			let newLayer = new BABYLON.SpriteLayer(
				this.spriteManager,
				this.name,
				layerIndex,
				this
			);
			this.layers[layerIndex] = newLayer;
		}
	}
	setFaceDirection(direction) {
		if (this.isFaceDirectionLocked) {
			return;
		}
		this.faceDirection = direction;
		// this.updateLayers()
	}
	updateLayers() {
		let currentAnimation = this.getCurrentAnimation();
		let activeFrame = this.getActiveFrame();
		this.frameCount = currentAnimation.frameCount;

		// An infinite animation delay won't do here, as it prevents the animation from restarting if(the speed changes again
		this.animationSpeedPercent = Math.max(1, this.animationSpeedPercent);
		// if (this.animationSpeedPercent == 0) {
		// 	this.animationSpeedPercent = 1;
		// }
		this.animationDelay =
			currentAnimation.animationDelay /
			(this.animationSpeedPercent / 100);

		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layerData = activeFrame.layers[layerIndex];
			this.updateLayer(layerIndex, layerData);
		}
	}
	getFrame(frameIndex) {
		let currentAnimation = this.getCurrentAnimation();

		let frame = currentAnimation.frames[frameIndex];
		if (frameIndex === undefined) {
			return this.getActiveFrame();
			// throw new Error("Not like this");
		}
		return frame;
	}
	getActiveFrame() {
		let currentAnimation = this.getCurrentAnimation();

		let activeFrame = currentAnimation.frames[this.currentFrameIndex];
		let frameIndexOverride = this.frameIndexOverrides[this.animationIndex]; // TODO is removed when changing classes
		if (frameIndexOverride !== undefined) {
			// override is used for heads only, and somewhat specific...
			activeFrame = currentAnimation.frames[frameIndexOverride];
		}
		return activeFrame;
	}
	setAnimationSpeed(animationSpeedPercent) {
		this.animationSpeedPercent = animationSpeedPercent;
	}
	getCurrentAnimation() {
		let relativeFaceDirection = this.getRelativeFaceDirection();

		// item and icons/shadows/other static sprites don't necessarily have all the face directions... skip the update in this case, and use whatever they had before
		// if(!currentAnimation) {
		// 	return
		// }
		// Not all sprites have different animations for all the possible directions

		let currentAnimation = this.animationData[this.animationIndex][
			relativeFaceDirection
		];
		return currentAnimation;
	}
	getViewDirectionDegrees() {
		// let activeCamera = this.camera;
		let sourceAlpha = 90 - (this.camera.alpha / Math.PI) * 180 + 360; // the camera starts at EAST for 0 degree, which isn't how we use the angles... 0 is south since sprites always face south by default. Also it moves counterclockwise, which is unintuitive
		// let viewAngleBeta = activeCamera.beta / math.pi * 180
		sourceAlpha = (Math.floor(sourceAlpha / 45) * 45) % 360;
		return sourceAlpha; //,  viewAngleBeta
	}
	// PERF 8.6% js_proxy (get C_Camera etc?)
	getRelativeFaceDirection() {
		let sourceAlpha = 90 - (this.camera.alpha / Math.PI) * 180 + 360; // the camera starts at EAST for 0 degree, which isn't how we use the angles... 0 is south since sprites always face south by default. Also it moves counterclockwise, which is unintuitive
		// let viewAngleBeta = activeCamera.beta / math.pi * 180
		sourceAlpha = (Math.floor(sourceAlpha / 45) * 45) % 360;
		// cameraDirection = this.getViewDirectionDegrees(); // avoid lookup in scope? perf matters here
		let relativeFaceDirection =
			relativeFaceDirections[this.faceDirection][sourceAlpha];
		// relativeFaceDirections[this.faceDirection][this.getViewDirectionDegrees()];
		if (this.isFaceDirectionLocked) {
			relativeFaceDirection = this.faceDirection;
		}
		return relativeFaceDirection;
	}
	getCorrectionOffsets(frameIndex) {
		let frame = this.getActiveFrame();
		if (!frame) { // out of sync with body?
			let correctionOffsets = {
				correctionU: 0,
				correctionV: 0,
			};
			return correctionOffsets;
		}
		if (frameIndex !== undefined) {
			// allows override for the doridori/look dir glitches
			frame = this.GetFrame(frameIndex);
		}

		// always use body?
		// dump(activeFrame.anchorPoints)
		let bodyPointer = frame.anchorPoints[0];
		if (!bodyPointer) {
			let correctionOffsets = {
				correctionU: 0,
				correctionV: 0,
			};
			return correctionOffsets;
		}
		let correctionU = bodyPointer.correctionU;
		let correctionV = bodyPointer.correctionV;
		let correctionOffsets = {
			correctionU: correctionU,
			correctionV: correctionV,
		};
		return correctionOffsets;
	}
	setFinalCorrectionOffsets(finalCorrectionU, finalCorrectionV) {
		this.finalCorrectionU = finalCorrectionU;
		this.finalCorrectionV = finalCorrectionV;
	}
	lockFaceDirection(lockedFlag) {
		this.isFaceDirectionLocked = lockedFlag;
	}
	areLayersAnimating() {
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			if (layer.isAnimating) {
				return true;
			}
		}
		return false;
	}
	animateNextFrame() {
		// console.log(
		// 	"Finished animating frame " +
		// 		this.currentFrameIndex +
		// 		" for animated sprite " +
		// 		this.name
		// );
		this.currentFrameIndex = this.currentFrameIndex + 1;

		let hasAnimatedLastFrame = this.currentFrameIndex >= this.frameCount;
		if (hasAnimatedLastFrame) {
			this.currentFrameIndex = 0;
			if (!this.isLooping) {
				// Debug(
				// 	format(
				// 		"Finished playback of non-looping sprite animation %s",
				// 		this.name
				// 	)
				// );
				// this.updateLayers(); // TODO: Is this needed? Should reset animation after one loop is completed
				// console.log(
				// 	"Finished playback of non-looping sprite animation " +
				// 		this.name
				// );
				// TODO: Is this needed?
				this.isAnimating = false;
				for (
					let layerIndex = 0;
					layerIndex < this.layers.length;
					layerIndex++
				) {
					let layer = this.layers[layerIndex];
					layer.isAnimating = false;
				}
				this.updateLayers();
				return;
			}
		}

		// Restart animation (for the same frame)
		this.isAnimating = true;
		// console.log(
		// 	"Animating next frame " +
		// 		this.currentFrameIndex +
		// 		" for " +
		// 		this.name
		// );
		// Restart layer animation
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			// layer.sprite.stopAnimation();
			layer.isAnimating = true;
			// layer.sprite.isVisible = true; // TODO
		}
		this.updateLayers();
		// this.updatePositionForAllLayers(); // if(the cellref or even just offsets changed in between updates, it will appear glitched because the sprite is still displayed at the old location very briefly. Could also hide/show it? But this should normally be rectified with the beforeRender update... hmm..
		// this.UpdateSpritePositions(); // HACKY to avoid inconsistencies... force update on ALL attachments to keep frames consistent --TODO same perf impact as in the update


		let activeFrame = this.getActiveFrame();
		let soundEffectIndex = activeFrame.soundEffectIndex;
		let soundEffectFileName = this.animationData.soundEffects[soundEffectIndex];
		if(soundEffectFileName === undefined) return;

		this.playSoundEffect(soundEffectFileName);
	}
	playSoundEffect(soundEffectFileName) {
		// console.log("Playing sound effect " + soundEffectFileName + " for frame " + this.currentFrameIndex);
		// TODO Do on creation only
		this.soundFolderPath = "Assets/Sounds/" // todo yikes
		// TODO: Reuse, only one should play at once
		var music = new BABYLON.Sound("music", this.soundFolderPath + soundEffectFileName, this.scene, null, {
			loop: false,
			autoplay: true,
			spatialSound: true
		  });
		  // I guess updating it on creation is enough? Not like the unit will move very far while the sound is playing
		  music.setPosition(new BABYLON.Vector3(this.worldX, this.worldY, this.worldZ));
	}

	getSourceDimensions(layerIndex) {
		let cellData = this.spriteManager._cellData;
		let activeFrame = this.getActiveFrame();
		let cellIndex = activeFrame.layers[layerIndex].spritesheetFrameIndex;
		if (cellIndex < 0) {
			let layer = this.layers[layerIndex];
			layer.isActive = false; // force hide because invalid spritesheet index means it can't be displayed
			return;
		} // hack for -1 sprite index in HEAD files (proper fix: later, once it's clear if/where else this may occur)
		// console.log(cellIndex, layerIndex, this.currentFrameIndex, this.animationIndex, relativeFaceDirection)
		let frameData = cellData[cellIndex].frame;

		let sourceWidth = frameData.w;
		let sourceHeight = frameData.h;
		let sourceDimensions = {
			width: sourceWidth,
			height: sourceHeight,
		};
		return sourceDimensions;
	}
	getLayerCount() {
		let maxLayerCount = 0;

		// for animationIndex, animation in pairs(self.animationData) do
		// 	for faceDirection, subAnimation in pairs(animation) do
		// 		for frameIndex, frame in pairs(subAnimation.frames) do
		// 			maxLayerCount = math.max(maxLayerCount, frame.layerCount)
		// 		end
		// 	end
		// end
		// return maxLayerCount
		for (const [animationIndex, animation] of Object.entries(
			this.animationData
		)) {
			for (const [faceDirection, subAnimation] of Object.entries(
				animation
			)) {
				// for (const [faceDirection, subAnimation] of Object.entries(animation)) {

				// console.log(`${faceDirection}: ${subAnimation}`);

				// for(faceDirection = 0, faceDirection < animation) { // SOUTH + 45 deg
				// let subAnimation = animation[faceDirection];
				for (const frameIndex in subAnimation.frames) {
					let frame = subAnimation.frames[frameIndex];
					// for(frameIndex, frame in pairs(subAnimation.frames) {
					maxLayerCount = Math.max(maxLayerCount, frame.layerCount);
				}
			}
		}
		return maxLayerCount;
	}
	getAnimationDataForLayer(layerIndex) {
		let activeFrame = this.getActiveFrame();
		if(!activeFrame) return;
		return activeFrame.layers[layerIndex];
	}
	// PERF 9.4% via BJS Misc/observable.ts.Observable.notifyObservers
	updatePositionForAllLayers() {
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			this.updatePositionForLayer(layerIndex);
		}
		// this.highlightActiveLayer(10);
	}
	// Debug stuff
	getActiveLayerCount() {
		let numActiveLayers = 0;
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			if (layer.isActive) numActiveLayers++;
		}

		return numActiveLayers;
	}
	// Debug stuff
	getVisibleLayerCount() {
		let numVisibleLayers = 0;
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			if (layer.sprite.isVisible) numVisibleLayers++;
		}

		return numVisibleLayers;
	}
	// Debug stuff
	highlightActiveLayer(layerIndex) {
		// for (
		// 	let layerIndex = 0;
		// 	layerIndex < this.layers.length;
		// 	layerIndex++
		// ) {

		// }
		let layer = this.layers[layerIndex];
		if (layer === undefined) return;
		if (layer.sprite === undefined) return;
		layer.sprite.color = new BABYLON.Color4(1, 0, 0, 1);
	}
	updatePositionForLayer(layerIndex) {
		// Only needed to make sure there's no jittering? Must be updated before changing layer positions
		// worldMatrix = this.camera.getWorldMatrix();
		let layer = this.layers[layerIndex];
		let sprite = layer.sprite;
		let layerData = this.getAnimationDataForLayer(layerIndex);

		// sprite.isVisible = true;
		// let numVisibleLayers = this.getVisibleLayerCount();
		// let numActiveLayers = this.getActiveLayerCount();
		// console.log(
		// 	"Updating position for layer " +
		// 		layerIndex +
		// 		", numActiveLayers = " +
		// 		numActiveLayers +
		// 		", numVisibleLayers = " +
		// 		numVisibleLayers
		// );

		if (!layerData) {
			// This layer isn't used by the current animation index?
			// sprite.position.x = this.worldX;
			// sprite.position.y = this.worldY;
			// sprite.position.z = this.worldZ;
			return;
		}

		let correctionOffsetU =
			layerData.offsetU + (this.finalCorrectionU || 0);
		let correctionOffsetV =
			layerData.offsetV + (this.finalCorrectionV || 0);

		// correctionOffsetU = layerData.offsetU;
		// correctionOffsetV = layerData.offsetV;

		// The sprite must move relative to the camera's view in order to appear as if(it's moving in its let (U,V) coordinate space
		// This is accomplished by taking the absolute direction (in UV space),
		//) { transforming it with the camera's view matrix (= changes required for any given object to appear orthogonal to it?)
		// let absoluteDirectionU = VECTOR3_AXIS_U
		// let absoluteDirectionV = VECTOR3_AXIS_V

		// let relativeDirectionU = Vector3.Zero();
		// let relativeDirectionV = Vector3.Zero();
		// Vector3.TransformNormalToRef(
		// 	VECTOR3_AXIS_U,
		// 	worldMatrix,
		// 	relativeDirectionU
		// );
		// Vector3.TransformNormalToRef(
		// 	VECTOR3_AXIS_V,
		// 	worldMatrix,
		// 	relativeDirectionV
		// );

		// relativeDirectionU.scaleInPlace(correctionOffsetU);
		// relativeDirectionV.scaleInPlace(correctionOffsetV);

		let correction = this.getWorldVectorFromPixelOffsets(
			correctionOffsetU,
			correctionOffsetV
		);

		sprite.position.x = this.worldX + correction.worldX;
		sprite.position.y = this.worldY + correction.worldY;
		sprite.position.z = this.worldZ + correction.worldZ;

		// sprite.position.x = this.worldX;
		// sprite.position.y = this.worldY;
		// sprite.position.z = this.worldZ;

		// if(layerIndex >= 8)
		// sprite.width = 0.01
		// else sprite.isVisible = false;
	}
	setFixedFrameForAnimation(animationIndex, frameIndex) {
		this.frameIndexOverrides[animationIndex] = frameIndex;
	}
	updateLayer(layerIndex, layerData) {
		// console.log("updateLayer", layerIndex, layerData)
		let layer = this.layers[layerIndex];

		let sprite = layer.sprite;
		sprite.isVisible = true;
		layer.isActive = true;

		// This layer is not relevant
		if (!layerData) {
			// console.log("layer " + layerIndex + " is NOT visible (no layer data)");
			layer.sprite.isVisible = false;
			layer.isActive = false;
			layer.isAnimating = false;
			return;
		}

		let sourceDimensions = this.getSourceDimensions(layerIndex);
		// TODO: This is a hack/fix for the -1 in head sprites (fix properly later, !sure where else it will occur)
		// The layer has an invalid spritesheet index and cannot be rendered (TODO: Fix in ACT converter and remove the layers)
		// If the animation only has one layer and it starts off invisible, still animate it or it will never proceed to the frames that are actually visible
		let sourceWidth = 0;
		let sourceHeight = 0;
		if (sourceDimensions === undefined) {
			// console.log("layer " + layerIndex + " is NOT visible (invalid spritesheet index)");
			// layer.sprite.isVisible = false; // BJS will not animate it if invisible... which is fine for inactive layers with correct index, but not those with -1?
			layer.isActive = false;
			layer.isAnimating = false;
			// sourceWidth = 0;
			// sourceWidth = 0;
			// return;
		} else {
			sourceWidth = sourceDimensions.width;
			sourceHeight = sourceDimensions.height;
		}

		// START OPTIMIZING HERE
		// console.log("layer " + layerIndex + " is now visible");

		// this.updatePositionForLayer(layerIndex); // anti glitch (if(cellref etc. changes it is displayed at the wrong position, briefly)

		sprite.cellRef = layerData.spritesheetFrameIndex; // TODO: Should use cellIndex instead?
		//sprite.cellIndex =parseFloat(sprite.cellRef);

		// TODO: DO it in Lua to  avoid checkjs lookups?
		// Update dimensions based on source frame data
		let normalizedWidth = sourceWidth / RENDERER_PIXELS_PER_WORLDUNIT;
		let normalizedHeight = sourceHeight / RENDERER_PIXELS_PER_WORLDUNIT;
		sprite.width = normalizedWidth * layerData.scaleU;
		sprite.height = normalizedHeight * layerData.scaleV;

		// this.updatePositionForLayer(layerIndex) // Do this once after ALL calculations are complete to prevent "jumping"

		sprite.angle = (layerData.rotationDegrees / 180) * Math.PI; // BJS expects radians, but we use deg
		sprite.invertU = layerData.isMirroredU;
		sprite.color = layerData.color;

		// STOP OPTIMIZING HERE

		// TODO Is this actually needed?
		if (!layer.isAnimating) {
			// Sprites can be updated as a snapshot, e.g. on creation, without a visible animation
			// return;
		}
		// console.log("is animating", layerIndex)
		sprite.playAnimation(
			layerData.spritesheetFrameIndex,
			layerData.spritesheetFrameIndex,
			false,
			// 25,
			this.animationDelay,
			layer.onAnimationFinished
		);

		// TODO: should picking also be enabled?
	}
	validateDimensions() {
		// Validate width and sourceWidth, because differing dimensions are not supported yet
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			let layerDimensions = {
				width: layer.width,
				height: layer.height,
			};
			if (layerDimensions.width === 0 || layerDimensions.height === 0) {
				let sourceDimensions = this.getSourceDimensions(layerIndex);
				if (
					sourceDimensions.width !== layerDimensions.width ||
					sourceDimensions.height !== layerDimensions.height
				) {
					// If I ever encounter this error, I know to investigate.
					// Until then, I'll just ignore it since I don't know what files (if any) use this property
					throw new Error(
						"Detected mismatching source and layer dimensions for layer " +
							layerIndex
					);
				}
			}
		}
	}

	createAnchors() {
		if (this.hasVisualizationPlanes) return;

		// Assign random anchor color to help visually distinguish the individual attachments
		let red = Math.random();
		let green = Math.random();
		let blue = Math.random();
		let anchorColor = new BABYLON.Color3(red, green, blue);
		let WHITE = BABYLON.Color3.White();

		this.createVisualizationPlanes(WHITE, anchorColor);
	}

	removeAnchors() {
		if (!this.hasVisualizationPlanes) return;

		this.destroyVisualizationPlanes();
	}

	createVisualizationPlanes(originColor, anchorColor) {
		if (this.hasVisualizationPlanes) return;
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			layer.createAnchorVisualization(originColor, anchorColor);
		}
		this.hasVisualizationPlanes = true;
	}
	destroyVisualizationPlanes() {
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			layer.destroyVisualizationPlanes();
		}
		this.hasVisualizationPlanes = false;
	}

	updateVisualizationPlanes() {
		for (
			let layerIndex = 0;
			layerIndex < this.layers.length;
			layerIndex++
		) {
			let layer = this.layers[layerIndex];
			layer.updateAnchorVisualization();
		}
	}
	getWorldVectorFromPixelOffsets(offsetU, offsetV) {
		// Update world matrix to make sure the result is as accurate as can be
		worldMatrix = this.camera.getWorldMatrix();

		let relativeDirectionU = Vector3.Zero();
		let relativeDirectionV = Vector3.Zero();
		// TransformNormalFromFloatsToRef ?
		Vector3.TransformNormalToRef(
			VECTOR3_AXIS_U,
			worldMatrix,
			relativeDirectionU
		);
		Vector3.TransformNormalToRef(
			VECTOR3_AXIS_V,
			worldMatrix,
			relativeDirectionV
		);

		offsetU = offsetU / RENDERER_PIXELS_PER_WORLDUNIT;
		offsetV = offsetV / RENDERER_PIXELS_PER_WORLDUNIT;

		// Is this needed? Floating point inaccuracies, should be 1 otherwise?
		relativeDirectionU.normalize();
		relativeDirectionV.normalize();

		relativeDirectionU.scaleInPlace(offsetU);
		relativeDirectionV.scaleInPlace(offsetV);

		// relativeDirectionU.normalize();
		// relativeDirectionV.normalize();

		let worldDisplacement = {
			worldX: relativeDirectionU.x + relativeDirectionV.x,
			worldY: relativeDirectionU.y + relativeDirectionV.y,
			worldZ: relativeDirectionU.z + relativeDirectionV.z,
		};
		return worldDisplacement;
	}
}

BABYLON.AnimatedSprite = AnimatedSprite;

class SpriteLayer {
	constructor(spriteManager, name, layerIndex, animatedSprite) {
		this.sprite = new BABYLON.Sprite(
			name + "LayerSprite" + layerIndex,
			spriteManager
		);
		this.name = name + "Layer" + layerIndex;
		this.layerIndex = layerIndex;
		this.isActive = false; // Start invisible to avoid glitches
		this.isAnimating = false;

		// instance.useAlphaForPicking = true; // can target the visible parts only. anything else would be weird

		this.sprite.parent = this; // hacky; BJS doesn't pass the layer on animation finished ;/

		// Note: Since this is called by BJS, it won't get the self parameter
		this.animatedSprite = animatedSprite;
		return this;
	}
	// PERF 72.8% via BJS ./Sprites/sprite.ts.Sprite._animate
	// TODO: Why do we have two of those? The layer is animated, then calls this, and both times it animates the next frame??
	onAnimationFinished() {
		let spriteLayer = this.parent; // hacky... BJS doesn't pass the actual SpriteLayer object...
		let animatedSprite = spriteLayer.animatedSprite;
		spriteLayer.isAnimating = false;
		// console.log(
		// 	"layer " +
		// 		spriteLayer.layerIndex +
		// 		" finished animating for frame " +
		// 		animatedSprite.currentFrameIndex
		// );
		if (!animatedSprite.areLayersAnimating()) {
			// 	console.log(
			// 		"onAnimationFinished for " +
			// 			spriteLayer.name +
			// 			", frame " +
			// 			animatedSprite.currentFrameIndex +
			// 			", animating next frame"
			// 	);
			animatedSprite.isAnimationFinished = true;
		}
	}
	// Update anchor point and return it
	getAnchorPoint() {
		let animatedSprite = this.animatedSprite;

		let correctionOffsets = animatedSprite.getCorrectionOffsets();
		let correctionVector = animatedSprite.getWorldVectorFromPixelOffsets(
			correctionOffsets.correctionU,
			correctionOffsets.correctionV
		);
		let anchorPoint = new BABYLON.Vector3(
			animatedSprite.worldX + correctionVector.worldX,
			animatedSprite.worldY + correctionVector.worldY,
			animatedSprite.worldZ + correctionVector.worldZ
		);
		this.anchorPoint = anchorPoint;
		return anchorPoint;
	}
	// Update origin and return it
	getOrigin() {
		let animatedSprite = this.animatedSprite;
		let origin = new BABYLON.Vector3(
			animatedSprite.worldX,
			animatedSprite.worldY,
			animatedSprite.worldZ
		);
		this.origin = origin;
		return origin;
	}
	// Create anchor plane
	createAnchorPlane(color) {
		let animatedSprite = this.animatedSprite;
		let name = this.name + "-AnchorVisualizationPlane";
		let options = {
			size: 1,
			scene: animatedSprite.scene,
		};
		let anchorVisualizationPlane = BABYLON.MeshBuilder.CreatePlane(
			name,
			options
		);
		anchorVisualizationPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
		anchorVisualizationPlane.visibility = 0.5;
		anchorVisualizationPlane.outlineColor = color || BABYLON.Color3.Blue();
		anchorVisualizationPlane.renderOutline = true;

		return anchorVisualizationPlane;
	}
	createOriginPlane(color) {
		let animatedSprite = this.animatedSprite;
		let name = this.name + "-OriginVisualizationPlane";
		let options = {
			size: 1,
			scene: animatedSprite.scene,
		};
		let originVisualizationPlane = BABYLON.MeshBuilder.CreatePlane(
			name,
			options
		);
		originVisualizationPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
		originVisualizationPlane.visibility = 0.5;
		originVisualizationPlane.outlineColor = color || BABYLON.Color3.White();
		originVisualizationPlane.renderOutline = true;
		return originVisualizationPlane;
	}
	createAnchorVisualization(originColor, anchorColor) {
		// Create origin plane
		let originVisualizationPlane = this.createOriginPlane(originColor);
		this.originVisualizationPlane = originVisualizationPlane;

		// Update origin plane
		// let origin = this.getOrigin();
		// originVisualizationPlane.position = origin;

		let anchorVisualizationPlane = this.createAnchorPlane(anchorColor);
		this.anchorVisualizationPlane = anchorVisualizationPlane;

		// // Update anchor plane
		// let anchorPoint = this.getAnchorPoint();
		// anchorVisualizationPlane.position = anchorPoint;
	}
	destroyOriginVisualizationPlane() {
		if (!this.originVisualizationPlane) return;
		this.originVisualizationPlane.dispose();
		delete this.originVisualizationPlane;
	}
	destroyAnchorVisualizationPlane() {
		if (!this.anchorVisualizationPlane) return;
		this.anchorVisualizationPlane.dispose();
		delete this.anchorVisualizationPlane;
	}
	destroyVisualizationPlanes() {
		this.destroyOriginVisualizationPlane();
		this.destroyAnchorVisualizationPlane();
	}
	updateAnchorVisualization() {
		// Update origin plane
		let origin = this.getOrigin();
		let originVisualizationPlane = this.originVisualizationPlane;
		originVisualizationPlane.position = origin;

		// Update anchor plane
		let anchorPoint = this.getAnchorPoint();
		let anchorVisualizationPlane = this.anchorVisualizationPlane;
		anchorVisualizationPlane.position = anchorPoint;

		originVisualizationPlane.isVisible = this.isActive;
		anchorVisualizationPlane.isVisible = this.isActive;
	}
}

BABYLON.SpriteLayer = SpriteLayer;
