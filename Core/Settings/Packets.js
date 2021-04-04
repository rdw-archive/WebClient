class Packet { // tbd what is this needed for? overhead...
	constructor() {}
}

// incoming

// Account
class AccountLoginAcceptedPacket extends Packet{ constructor() {}}
class AccountLoginRejectedPacket extends Packet{
	constructor(banExpiryDate) {
		this.banExpiryDate = banExpiryDate
	}
}

// session
class SessionDisconnectedPacket extends Packet{ constructor() {}} // timeout
class SessionTerminatedPacket extends Packet{ constructor() {}} // maintenance, ban?

// Characters
class CharactersUpdatedPacket extends Packet{ constructor() {}}


// Unit
class UnitSpawnedPacket extends Packet{ constructor() {}}
class UnitExistsPacket extends Packet{ constructor() {}}
class UnitDiedPacket extends Packet{ constructor() {}}
class UnitRemovedPacket extends Packet{ constructor() {}}
class UnitResurrectedPacket extends Packet{ constructor() {}}
class UnitIsAwayPacket extends Packet{ constructor() {}}
class UnitClassChangedPacket extends Packet{ constructor() {}}
class UnitAppearanceChangedPacket extends Packet{ constructor() {}}
class UnitBaseLevelUpPacket extends Packet{ constructor() {}}
class UnitJobLevelUpPacket extends Packet{ constructor() {}}

// Map
class MapChangedPacket extends Packet{ constructor(mapID, mapU, mapV) {}}
class MapChangeCompletedPacket extends Packet{ constructor() {}} // only if maps have actually changed (instant loading otherwise)

// Movement
class UnitStartedMovingPacket extends Packet{ constructor() {}}
class UnitStoppedMovingPacket extends Packet{ constructor() {}}
class UnitPositionChangedPacket extends Packet{ constructor() {}}

// Melee combat
class UnitAttackedPacket extends Packet{ constructor() {}}
class UnitMissedPacket extends Packet{ constructor() {}}
class UnitReceivedDamagePacket extends Packet{ constructor() {}}

// Spellcasting
class SpellcastStartedPacket extends Packet{ constructor() {}}
class SpellcastInterruptedPacket extends Packet{ constructor() {}}
class SpellcastFinishedPacket extends Packet{ constructor() {}}

// AOE
class AreaSpellcastStartedPacket extends Packet{ constructor() {}}
class AreaSpellcastFinishedPacket extends Packet{ constructor() {}}
class AreaSpellcastOngoingPacket extends Packet{ constructor() {}}

// Effects
class EffectTriggeredPacket extends Packet{ constructor() {}}
// class LoginRejectedPacket extends Packet{ constructor() {}}
// class LoginRejectedPacket extends Packet{ constructor() {}}

// Auras
class UnitAuraAppliedPacket extends Packet{ constructor() {}}
class UnitAuraRemovedPacket extends Packet{ constructor() {}}

// Loot
class ItemExistsPacket extends Packet{ constructor() {}}
class ItemDroppedPacket extends Packet{ constructor() {}}
class ItemRemovedPacket extends Packet{ constructor() {}}

// Items
class ItemObtainedPacket extends Packet{ constructor() {}}
class ItemPickedUpPacket extends Packet{ constructor() {}}
class ItemCreatedPacket extends Packet{ constructor() {}}

// Equipment
class ItemEquippedPacket extends Packet{ constructor() {}}
class ItemUnequippedPacket extends Packet{ constructor() {}}
class ItemDestroyedPacket extends Packet{ constructor() {}}

// Talents
class TalentPointsChangedPacket extends Packet{ constructor() {}}
class TalentLearnedPacket extends Packet{ constructor() {}}
class TalentUnlearnedPacket extends Packet{ constructor() {}}
class TalentsResetPacket extends Packet{ constructor() {}}

// Experience
class BaseExperienceGainedPacket extends Packet{ constructor() {}}
class BaseExperienceLostPacket extends Packet{ constructor() {}}
class JobExperienceGainedPacket extends Packet{ constructor() {}}
class JobExperienceLostPacket extends Packet{ constructor() {}}

// Stats
class LoginRejectedPacket extends Packet{ constructor() {}}
class LoginAcceptedPacket extends Packet{ constructor() {}}

// Party
// Guild
// Instances
// Trade
// Storage
// etc


// outgoing
class RequestAccountLoginPacket extends Packet{ constructor() {}}
class RequestCharacterDeletionPacket extends Packet{ constructor() {}}
class RequestCharacterLoginPacket extends Packet{ constructor() {}}
class RequestMapChangeCompletionPacket extends Packet{ constructor() {}}
// class SpellcastInterruptedPacket extends Packet{ constructor() {}}
// class SpellcastInterruptedPacket extends Packet{ constructor() {}}
// class SpellcastInterruptedPacket extends Packet{ constructor() {}}
// class SpellcastInterruptedPacket extends Packet{ constructor() {}}
// class SpellcastInterruptedPacket extends Packet{ constructor() {}}






const SUPPORTED_PACKETS = {
	// Incoming
	ACCOUNT_LOGIN_REJECTED: AccountLoginRejectedPacket,
	ACCOUNT_LOGIN_ACCEPTED: AccountLoginAcceptedPacket,
	// CHARACTER_LOGIN_FAILED: CharacterLoginFailedPacket,

	MAP_CHANGED: MapChangedPacket,

	UNIT_SPAWNED: UnitSpawnedPacket,
	UNIT_EXISTS: UnitExistsPacket,

	// Outgoing
	REQUEST_ACCOUNT_LOGIN: RequestAccountLoginPacket,
	REQUEST_CHARACTER_LOGIN: RequestAccountLoginPacket,
	REQUEST_MAPCHANGE_COMPLETION: RequestMapChangeCompletionPacket,
};
