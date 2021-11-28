const SystemOptions = {
	frame: new OptionsFrame("SystemOptionsFrame"),
	categories: ["Advanced", "Graphics", "Languages", "Network", "Sound"],
	onLoad() {
		this.createWidgets();
		this.registerEventListeners();
		this.frame.hide();
	},
	show() {
		this.frame.show();
	},
	hide() {
		this.frame.hide();
	},
	createWidgets() {
		this.createWebAudioOptions();
	},
	createWebAudioOptions() {
		const soundOptionsPanel = new Frame(
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

		this.soundOptionsPanel = soundOptionsPanel;

		this.createGeneralSettingsGroup();
		this.createChannelSettingsGroup();
		this.createVolumeSettingsGroup();

		this.frame.addCategoryPanel("Sound", soundOptionsPanel);
	},
	createGeneralSettingsGroup() {
		const generalSettingsGroup = new OptionsGroup(
			"SystemOptionsFrame_SoundOptions_GeneralSettingsGroup",
			this.soundOptionsPanel,
			"OptionsGroup"
		);
		generalSettingsGroup.setCaption(L["General"]);
		generalSettingsGroup.setCaptionStyle("CaptionFontSmall");
		this.generalSettingsGroup = generalSettingsGroup;

		this.createGlobalSoundToggle();
		this.createHighQualityStereoToggle();
		this.createBackgroundVolumeToggle();
		this.createBackgroundVolumeSlider();
	},
	createGlobalSoundToggle() {
		const enableSoundCheckbox = new CheckButton(
			"SystemOptionsFrame_SoundOptions_GeneralSettingsGroup_GlobalSoundToggle",
			this.generalSettingsGroup.fieldSet
		);
		enableSoundCheckbox.setScript("OnClick", () => {
			if (!enableSoundCheckbox.isChecked()) C_WebAudio.disableSound();
			else C_WebAudio.enableSound();
		});
		enableSoundCheckbox.setText(L["Enable Sound"]);
		enableSoundCheckbox.setChecked(C_Settings.getValue("enableSound"));
	},
	createHighQualityStereoToggle() {
		const useHighQualityStereoCheckbox = new CheckButton(
			"SystemOptionsFrame_SoundOptions_GeneralSettingsGroup_HighQualityStereoToggle",
			this.generalSettingsGroup.fieldSet
		);
		useHighQualityStereoCheckbox.setScript("OnClick", () => {
			if (!useHighQualityStereoCheckbox.isChecked()) C_WebAudio.useHighQualityStereo(false);
			else C_WebAudio.useHighQualityStereo(true);
		});
		useHighQualityStereoCheckbox.setText(L["Use High-Quality Stereo"]);
		useHighQualityStereoCheckbox.setChecked(C_Settings.getValue("useHighQualityStereo"));
	},
	createBackgroundVolumeToggle() {
		const soundInBackgroundCheckbox = new CheckButton(
			"SystemOptionsFrame_SoundOptions_GeneralSettingsGroup_BackgroundFadeToggle",
			this.generalSettingsGroup.fieldSet
		);
		soundInBackgroundCheckbox.setScript("OnClick", () => {
			if (!soundInBackgroundCheckbox.isChecked()) C_WebAudio.setBackgroundFade(false);
			else C_WebAudio.setBackgroundFade(true);
		});
		soundInBackgroundCheckbox.setText(L["Lower Volume in Background"]);
		soundInBackgroundCheckbox.setChecked(C_Settings.getValue("fadeSoundInBackground"));
	},
	createBackgroundVolumeSlider() {
		const backgroundVolumeSlider = new Slider(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup_BackgroundVolumeSlider",
			this.generalSettingsGroup.fieldSet
		);
		backgroundVolumeSlider.setLabelText(L["Background Volume"]);
		backgroundVolumeSlider.setScript("OnInput", () => {
			C_WebAudio.setBackgroundVolume(backgroundVolumeSlider.getValue() / 100);
		});
		backgroundVolumeSlider.setValue(C_Settings.getValue("backgroundAudioVolume") * 100);
	},
	createChannelSettingsGroup() {
		const channelSettingsGroup = new OptionsGroup(
			"SystemOptionsFrame_SoundOptions_ChannelSettingsGroup",
			this.soundOptionsPanel,
			"OptionsGroup"
		);
		channelSettingsGroup.setCaption(L["Audio Channels"]);
		channelSettingsGroup.setCaptionStyle("CaptionFontSmall");

		this.channelSettingsGroup = channelSettingsGroup;

		this.createMusicToggle();
		this.createEffectSoundToggle();
		this.createAmbientSoundToggle();
	},
	createMusicToggle() {
		const musicToggle = new CheckButton(
			"SystemOptionsFrame_SoundOptions_ChannelSettingsGroup_MusicToggle",
			this.channelSettingsGroup.fieldSet
		);
		musicToggle.setScript("OnClick", () => {
			if (!musicToggle.isChecked()) C_WebAudio.disableMusicTrack();
			else C_WebAudio.enableMusicTrack();
		});
		musicToggle.setText(L["Music"]);
		musicToggle.setChecked(C_Settings.getValue("enableMusic"));
	},
	createEffectSoundToggle() {
		const soundEffectToggle = new CheckButton(
			"SystemOptionsFrame_SoundOptions_ChannelSettingsGroup_SoundEffectsToggle",
			this.channelSettingsGroup.fieldSet
		);
		soundEffectToggle.setScript("OnClick", () => {
			if (!soundEffectToggle.isChecked()) C_WebAudio.disableEffectsTrack();
			else C_WebAudio.enableEffectsTrack();
		});
		soundEffectToggle.setText(L["Sound Effects"]);
		soundEffectToggle.setChecked(C_Settings.getValue("enableSFX"));
	},
	createAmbientSoundToggle() {
		const ambientSoundToggle = new CheckButton(
			"SystemOptionsFrame_SoundOptions_ChannelSettingsGroup_AmbientSoundsToggle",
			this.channelSettingsGroup.fieldSet
		);
		ambientSoundToggle.setScript("OnClick", () => {
			if (!ambientSoundToggle.isChecked()) C_WebAudio.disableAmbienceTrack();
			else C_WebAudio.enableAmbienceTrack();
		});
		ambientSoundToggle.setText(L["Ambient Sounds"]);
		ambientSoundToggle.setChecked(C_Settings.getValue("enableAmbientSounds"));
	},
	createVolumeSettingsGroup() {
		const volumeSettingsGroup = new OptionsGroup(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup",
			this.soundOptionsPanel,
			"OptionsGroup"
		);
		volumeSettingsGroup.setCaption(L["Volume Settings"]);
		volumeSettingsGroup.setCaptionStyle("CaptionFontSmall");
		this.volumeSettingsGroup = volumeSettingsGroup;

		this.createVolumeSettingsSliders();
	},
	createVolumeSettingsSliders() {
		this.createGlobalVolumeSlider();
		this.createMusicVolumeSlider();
		this.createEffectsVolumeSlider();
		this.createAmbienceVolumeSlider();
	},
	createGlobalVolumeSlider() {
		const globalVolumeSlider = new Slider(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup_GlobalVolumeSlider",
			this.volumeSettingsGroup.fieldSet
		);
		globalVolumeSlider.setLabelText(L["Global Volume"]);
		globalVolumeSlider.setScript("OnInput", () => {
			C_WebAudio.setGlobalVolume(globalVolumeSlider.getValue() / 100);
		});
		globalVolumeSlider.setValue(C_Settings.getValue("globalVolume") * 100);
	},
	createMusicVolumeSlider() {
		const musicVolumeSlider = new Slider(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup_MusicVolumeSlider",
			this.volumeSettingsGroup.fieldSet
		);

		musicVolumeSlider.setLabelText(L["Music"]);
		musicVolumeSlider.setScript("OnInput", () => {
			C_WebAudio.setMusicVolume(musicVolumeSlider.getValue() / 100);
		});
		musicVolumeSlider.setValue(C_Settings.getValue("musicVolume") * 100);
	},
	createEffectsVolumeSlider() {
		const effectsVolumeSlider = new Slider(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup_EffectsVolumeSlider",
			this.volumeSettingsGroup.fieldSet
		);

		effectsVolumeSlider.setLabelText(L["Sound Effects"]);
		effectsVolumeSlider.setScript("OnInput", () => {
			C_WebAudio.setEffectsVolume(effectsVolumeSlider.getValue() / 100);
		});
		effectsVolumeSlider.setValue(C_Settings.getValue("sfxVolume") * 100);
	},
	createAmbienceVolumeSlider() {
		const ambienceVolumeSlider = new Slider(
			"SystemOptionsFrame_SoundOptions_VolumeSettingsGroup_AmbienceVolumeSlider",
			this.volumeSettingsGroup.fieldSet
		);
		ambienceVolumeSlider.setLabelText(L["Ambience"]);
		ambienceVolumeSlider.setScript("OnInput", () => {
			C_WebAudio.setAmbienceVolume(ambienceVolumeSlider.getValue() / 100);
		});
		ambienceVolumeSlider.setValue(C_Settings.getValue("ambienceVolume") * 100);
	},
	registerEventListeners() {
		document.addEventListener("visibilitychange", () => this.onWindowVisibilityChanged(document.hidden));
	},
	onWindowVisibilityChanged(isApplicationWindowHidden) {
		if (!C_Settings.getValue("fadeSoundInBackground")) return;

		if (isApplicationWindowHidden) this.applyBackgroundVolumeReduction();
		else this.restoreGlobalVolume();
	},
	applyBackgroundVolumeReduction() {
		C_EventSystem.triggerEvent("APPLICATION_WINDOW_HIDDEN");
		const backgroundVolume = C_Settings.getValue("backgroundAudioVolume") * C_Settings.getValue("globalVolume");
		C_WebAudio.setGlobalVolume(backgroundVolume, false);
	},
	restoreGlobalVolume() {
		C_EventSystem.triggerEvent("APPLICATION_WINDOW_VISIBLE");
		C_WebAudio.setGlobalVolume(C_Settings.getValue("globalVolume"), false);
	},
};

SystemOptions.onLoad();
