const GameMenuFrame = new Frame("GameMenuFrame");

GameMenuFrame.createButtonGroups = function () {
	this.metaGroup = new Frame("GameMenu_MetaGroup", GameMenuFrame);
	this.optionsGroup = new Frame("GameMenu_OptionsGroup", GameMenuFrame);
	this.exitGroup = new Frame("GameMenu_ExitGroup", GameMenuFrame);
	this.returnGroup = new Frame("GameMenu_ReturnGroup", GameMenuFrame);
};

GameMenuFrame.createSupportButton = function () {
	this.addonOptionsButton = new Button("GameMenu_SupportButton", this.metaGroup);
	this.addonOptionsButton.setText(L["Support"]);
	this.addonOptionsButton.setScript("OnClick", function () {
		GameMenuFrame.hide();
		SupportFrame.show();
	});
};

GameMenuFrame.createWhatsNewButton = function () {
	this.addonOptionsButton = new Button("GameMenu_WhatsNewButton", this.metaGroup);
	this.addonOptionsButton.setText(L["What's New"]);
	this.addonOptionsButton.setScript("OnClick", function () {
		GameMenuFrame.hide();
		ChangeLogSummaryFrame.show();
	});
};

GameMenuFrame.createCreditsButton = function () {
	this.creditsButton = new Button("GameMenu_CreditsNewButton", this.metaGroup);
	this.creditsButton.setText(L["Credits"]);
	this.creditsButton.setScript("OnClick", function () {
		GameMenuFrame.hide();
		CreditsFrame.show();
	});
};

GameMenuFrame.createSystemOptionsButton = function () {
	this.addonOptionsButton = new Button("GameMenu_SystemOptionsButton", this.optionsGroup);
	this.addonOptionsButton.setText(L["System"]);
	this.addonOptionsButton.setScript("OnClick", function () {
		GameMenuFrame.hide();
		SystemOptionsFrame.show();
	});
};

GameMenuFrame.createInterfaceOptionsButton = function () {
	this.addonOptionsButton = new Button("GameMenu_InterfaceOptionsButton", this.optionsGroup);
	this.addonOptionsButton.setText(L["Interface"]);
	this.addonOptionsButton.setScript("OnClick", function () {
		GameMenuFrame.hide();
		InterfaceOptionsFrame.show();
	});
};

GameMenuFrame.createKeybindingOptionsButton = function () {
	this.addonOptionsButton = new Button("GameMenu_KeybindingsOptionsButton", this.optionsGroup);
	this.addonOptionsButton.setText(L["Keybindings"]);
	this.addonOptionsButton.setScript("OnClick", function () {
		GameMenuFrame.hide();
		KeybindingsOptionsFrame.show();
	});
};

GameMenuFrame.createMacroOptionsButton = function () {
	this.addonOptionsButton = new Button("GameMenu_MacroOptionsButton", this.optionsGroup);
	this.addonOptionsButton.setText(L["Macros"]);
	this.addonOptionsButton.setScript("OnClick", function () {
		GameMenuFrame.hide();
		MacroFrame.show();
	});
};

GameMenuFrame.createAddonOptionsButton = function () {
	this.addonOptionsButton = new Button("GameMenu_AddOnsButton", this.optionsGroup);
	this.addonOptionsButton.setText(L["AddOns"]);
	this.addonOptionsButton.setScript("OnClick", function () {
		GameMenuFrame.hide();
		AddonOptionsFrame.show();
	});
};

GameMenuFrame.createLogOutButton = function () {
	this.logOutButton = new Button("GameMenu_LogOutButton", this.exitGroup);
	this.logOutButton.setText(L["Log Out"]);
	this.logOutButton.setScript("OnClick", function () {
		C_Message.postMessage("REQUEST_CHARACTER_LOGOUT");
	});
};

GameMenuFrame.createExitButton = function () {
	this.exitButton = new Button("GameMenu_ExitButton", this.exitGroup);
	this.exitButton.setText(L["Exit Game"]);
	this.exitButton.setScript("OnClick", function () {
		C_AppControl.exitMainThread();
	});
};

GameMenuFrame.createReturnButton = function () {
	this.returnButton = new Button("GameMenu_ReturnButton", this.returnGroup);
	this.returnButton.setText(L["Return to Game"]);
	this.returnButton.setScript("OnClick", function () {
		GameMenuFrame.hide();
	});
};

GameMenuFrame.createButtonGroups();
GameMenuFrame.createSupportButton();
GameMenuFrame.createWhatsNewButton();
GameMenuFrame.createCreditsButton();

GameMenuFrame.createSystemOptionsButton();
GameMenuFrame.createInterfaceOptionsButton();
GameMenuFrame.createKeybindingOptionsButton();
GameMenuFrame.createMacroOptionsButton();
GameMenuFrame.createAddonOptionsButton();

GameMenuFrame.createLogOutButton();
GameMenuFrame.createExitButton();

GameMenuFrame.createReturnButton();

C_Keybindings.setBinding(KEY_CODE_ESC, function () {
	GameMenuFrame.toggle();
});

GameMenuFrame.hide();
