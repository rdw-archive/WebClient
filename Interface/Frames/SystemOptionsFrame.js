const SystemOptions = {
	frame: new OptionsFrame("SystemOptionsFrame"),
	categories: ["Advanced", "Graphics", "Languages", "Network", "Sound"],
	onLoad() {
		this.createWidgets();
		this.frame.hide();
	},
	show() {
		this.frame.show();
	},
	hide() {
		this.frame.hide();
	},
	createWidgets() {
		// Create WebAudio settings panel
		let soundOptionsPanel = new Frame(
			"SystemOptionsFrame_SoundOptionsPanel",
			this.frame._obj.content.rightPane,
			"OptionsFrameCategoryPanel"
		);

		soundOptionsPanel.header = new Frame(
			"SystemOptionsFrame_SoundOptions_PanelHeader",
			soundOptionsPanel,
			"OptionsFrameCategoryHeader"
		);
		soundOptionsPanel.headerText = soundOptionsPanel.header.createFontString(
			"SystemOptionsFrame_SoundOptions_PanelHeader",
			"MEDIUM",
			"CaptionFontLarge"
		);
		soundOptionsPanel.headerText.setText("WebAudio Configuration");

		// Create general settings group
		let generalSettingsGroup = new OptionsGroup(
			"SystemOptionsFrame_SoundOptions_GeneralSettingsGroup",
			soundOptionsPanel,
			"OptionsGroup"
		);
		generalSettingsGroup.setCaption(L["General"]);
		generalSettingsGroup.setCaptionStyle("CaptionFontSmall");
		// Create global sound toggle checkbox
		let checkbox = new CheckButton(
			"SystemOptionsFrame_SoundOptions_GeneralSettingsGroup_GlobalSoundToggle",
			generalSettingsGroup.fieldSet
		);
		checkbox.setScript("OnClick", () => {
			DEBUG("Functionality NYI");
		});
		checkbox.setText(L["Enable Sound"]);

		// Create audio channel settings group
		let channelSettingsGroup = new OptionsGroup(
			"SystemOptionsFrame_SoundOptions_ChannelSettingsGroup",
			soundOptionsPanel,
			"OptionsGroup"
		);
		channelSettingsGroup.setCaption(L["Audio Channels"]);
		channelSettingsGroup.setCaptionStyle("CaptionFontSmall");
		// Create checkboxes

		let backgroundMusicToggle = new CheckButton(
			"SystemOptionsFrame_SoundOptions_ChannelSettingsGroup_BackgroundbackgroundMusicToggle",
			channelSettingsGroup.fieldSet
		);
		backgroundMusicToggle.setScript("OnClick", () => {
			DEBUG("Functionality NYI");
		});
		backgroundMusicToggle.setText(L["Music"]);

		let soundEffectToggle = new CheckButton(
			"SystemOptionsFrame_SoundOptions_ChannelSettingsGroup_SoundEffectsToggle",
			channelSettingsGroup.fieldSet
		);
		soundEffectToggle.setScript("OnClick", () => {
			DEBUG("Functionality NYI");
		});
		soundEffectToggle.setText(L["Sound Effects"]);

		let ambientSoundToggle = new CheckButton(
			"SystemOptionsFrame_SoundOptions_ChannelSettingsGroup_AmbientSoundsToggle",
			channelSettingsGroup.fieldSet
		);
		ambientSoundToggle.setScript("OnClick", () => {
			DEBUG("Functionality NYI");
		});
		ambientSoundToggle.setText(L["Ambient Sounds"]);

		let soundInBackgroundToggle = new CheckButton(
			"SystemOptionsFrame_SoundOptions_ChannelSettingsGroup_SoundInBackgroundToggle",
			channelSettingsGroup.fieldSet
		);
		soundInBackgroundToggle.setScript("OnClick", () => {
			DEBUG("Functionality NYI");
		});
		soundInBackgroundToggle.setText(L["Sound in Background"]);

		// Create volume settings group
		let volumeSettingsGroup = new OptionsGroup(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup",
			soundOptionsPanel,
			"OptionsGroup"
		);
		volumeSettingsGroup.setCaption(L["Volume Settings"]);
		volumeSettingsGroup.setCaptionStyle("CaptionFontSmall");
		// Create sliders
		let masterVolumeSlider = new Slider(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup_MasterVolumeSlider",
			volumeSettingsGroup.fieldSet
		);
		masterVolumeSlider.setLabelText(L["Master Volume"]);
		masterVolumeSlider.setScript("OnInput", () => {
			DEBUG("Functionality NYI");
		});

		let effectsVolumeSlider = new Slider(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup_EffectsVolumeSlider",
			volumeSettingsGroup.fieldSet
		);
		effectsVolumeSlider.setLabelText(L["Sound Effects"]);
		effectsVolumeSlider.setScript("OnInput", () => {
			DEBUG("Functionality NYI");
		});

		let musicVolumeSlider = new Slider(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup_MusicVolumeSlider",
			volumeSettingsGroup.fieldSet
		);
		musicVolumeSlider.setLabelText(L["Music"]);
		musicVolumeSlider.setScript("OnInput", () => {
			DEBUG("Functionality NYI");
		});

		let ambienceVolumeSlider = new Slider(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup_AmbienceVolumeSlider",
			volumeSettingsGroup.fieldSet
		);
		ambienceVolumeSlider.setLabelText(L["Ambience"]);
		ambienceVolumeSlider.setScript("OnInput", () => {
			DEBUG("Functionality NYI");
		});

		this.frame.addCategoryPanel("Sound", soundOptionsPanel);

		this.soundOptionsPanel = soundOptionsPanel;
	},
};

SystemOptions.onLoad();
