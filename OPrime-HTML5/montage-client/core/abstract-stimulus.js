/**
 * @module ui/stimulus.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	Response = require("ui/response.reel").Response,
	PressComposer = require("montage/composer/press-composer").PressComposer,
	RangeController = require("montage/core/range-controller").RangeController;

/**
 * @class Stimulus
 * @extends Component
 */
exports.AbstractStimulus = Component.specialize( /** @lends Stimulus# */ {
	constructor: {
		value: function Stimulus() {
			this.super();
			this.responses = [];
			this.nonResponses = [];
			this.rangeController = new RangeController().initWithContent(this.responses);
		}
	},

	rangeController: {
		value: null
	},

	addResponse: {
		value: function(target, stimulusId) {
			if (!target) {
				throw "Cannot add response without the x y information found in the touch/click target";
			}
			var response = {
				"reactionTimeAudioOffset": null,
				"reactionTimeAudioOnset": null,
				"x": target.x,
				"y": target.y,
				"chosenVisualStimulus": stimulusId,
				"responseScore": 1
			};
			this.responses.push(response);
			console.log("Recorded response", response);
		}
	},

	addNonResponse: {
		value: function(target) {
			if (!target) {
				throw "Cannot add response without the x y information found in the touch/click target";
			}
			var response = {
				"reactionTimeAudioOffset": null,
				"reactionTimeAudioOnset": null,
				"x": target.x,
				"y": target.y,
				"chosenVisualStimulus": "none",
				"responseScore": -1
			};
			this.nonResponses.push(response);
			console.log("Recorded non-response, the user is confused or not playing the game.", response);
		}
	},

	/*
	 * Machinery for Recording stimuli responses.
	 * 
	 * Inspired by the digit video reel: 
	 * https://github.com/montagejs/digit/tree/master/ui/video.reel
	 */
	enterDocument: {
		value: function(firstTime) {
			this.super();

			if (firstTime) {
				this.setupFirstPlay();
				this.addOwnPropertyChangeListener("src", this);
			}
		}
	},

	handlePress: {
		value: function(e) {
			console.log("The stimulus has been pressed: ");
			if (e && e.targetElement && e.targetElement.dataset && e.targetElement.dataset.montageId && e.targetElement.classList.contains("Stimulus-record-touch-response")) {
				this.addResponse(e.targetElement, e.targetElement.dataset.montageId);
			} else {
				this.addNonResponse(e.targetElement);
			}
		}
	},

	prepareForActivationEvents: {
		value: function() {
			this._pressComposer.addEventListener("pressStart", this, false);
			this._pressComposer.addEventListener("press", this, false);
			this._pressComposer.addEventListener("pressCancel", this, false);
		}
	},

	setupFirstPlay: {
		value: function() {
			this.element.removeEventListener("touchstart", this, false);
			this.element.removeEventListener("mousedown", this, false);
			// this._firstPlay = true;
			// this.videoController.stop();

			// this.classList.add("digit-Video--firstPlay");
			// this.classList.remove("digit-Video--showControls");

			this._pressComposer = PressComposer.create();
			this._pressComposer.identifier = "stimulus";
			this.addComposerForElement(this._pressComposer, this.element);
			// this.showPoster();
		}
	}

});