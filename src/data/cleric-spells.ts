// D&D 5e Cleric Spells Database

import { Spell, Spellbook } from '../utils/spells.js';

// Comprehensive Cleric Spell List
export const CLERIC_SPELLS: Spellbook = {
  cantrips: [
    {
      name: "Guidance",
      level: 0,
      school: "Divination",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
      description: "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. The creature can wait until after it rolls the d20 before deciding to use the Guidance die, but must decide before the DM says whether the roll succeeds or fails.",
      concentration: true
    },
    {
      name: "Light",
      level: 0,
      school: "Evocation",
      castingTime: "1 action",
      range: "Touch",
      components: "V, M",
      duration: "1 hour",
      description: "You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the object with something opaque blocks the light. The spell ends if you cast it again or dismiss it as an action."
    },
    {
      name: "Mending",
      level: 0,
      school: "Transmutation",
      castingTime: "1 minute",
      range: "Touch",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage."
    },
    {
      name: "Resistance",
      level: 0,
      school: "Abjuration",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S, M",
      duration: "Concentration, up to 1 minute",
      description: "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. The creature can wait until after it rolls the d20 before deciding to use the Resistance die, but must decide before the DM says whether the roll succeeds or fails.",
      concentration: true
    },
    {
      name: "Sacred Flame",
      level: 0,
      school: "Evocation",
      castingTime: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      description: "Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw."
    },
    {
      name: "Spare the Dying",
      level: 0,
      school: "Necromancy",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
      description: "You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs."
    },
    {
      name: "Thaumaturgy",
      level: 0,
      school: "Transmutation",
      castingTime: "1 action",
      range: "30 feet",
      components: "V",
      duration: "Up to 1 minute",
      description: "You manifest a minor wonder, a sign of supernatural power, within range. You create one of several magical effects within range."
    }
  ],
  level1: [
    {
      name: "Bless",
      level: 1,
      school: "Enchantment",
      castingTime: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "Concentration, up to 1 minute",
      description: "You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.",
      concentration: true,
      higherLevel: "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."
    },
    {
      name: "Command",
      level: 1,
      school: "Enchantment",
      castingTime: "1 action",
      range: "60 feet",
      components: "V",
      duration: "1 round",
      description: "You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it.",
      higherLevel: "When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them."
    },
    {
      name: "Cure Wounds",
      level: 1,
      school: "Evocation",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
      description: "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
      higherLevel: "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st."
    },
    {
      name: "Detect Evil and Good",
      level: 1,
      school: "Divination",
      castingTime: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
      description: "For the duration, you know if there is an aberration, celestial, elemental, fey, fiend, or undead within 30 feet of you, as well as where the creature is located but not its identity. Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the hallow spell.",
      concentration: true
    },
    {
      name: "Detect Magic",
      level: 1,
      school: "Divination",
      castingTime: "1 action",
      range: "Self",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
      description: "For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.",
      concentration: true,
      ritual: true
    },
    {
      name: "Guiding Bolt",
      level: 1,
      school: "Evocation",
      castingTime: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "1 round",
      description: "A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.",
      higherLevel: "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st."
    },
    {
      name: "Healing Word",
      level: 1,
      school: "Evocation",
      castingTime: "1 bonus action",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      description: "A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
      higherLevel: "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st."
    },
    {
      name: "Inflict Wounds",
      level: 1,
      school: "Necromancy",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
      description: "Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage.",
      higherLevel: "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st."
    },
    {
      name: "Sanctuary",
      level: 1,
      school: "Abjuration",
      castingTime: "1 bonus action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      description: "You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from area effects, such as the explosion of a fireball."
    },
    {
      name: "Shield of Faith",
      level: 1,
      school: "Abjuration",
      castingTime: "1 bonus action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Concentration, up to 10 minutes",
      description: "A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.",
      concentration: true
    }
  ],
  level2: [
    {
      name: "Aid",
      level: 2,
      school: "Abjuration",
      castingTime: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "8 hours",
      description: "Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration.",
      higherLevel: "When you cast this spell using a spell slot of 3rd level or higher, a target's hit points increase by an additional 5 for each slot level above 2nd."
    },
    {
      name: "Augury",
      level: 2,
      school: "Divination",
      castingTime: "1 minute",
      range: "Self",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "By casting gem-inlaid sticks, rolling dragon bones, laying out ornate cards, or employing some other divining tool, you receive an omen from an otherworldly entity about the results of a specific course of action that you plan to take within the next 30 minutes.",
      ritual: true
    },
    {
      name: "Blindness/Deafness",
      level: 2,
      school: "Necromancy",
      castingTime: "1 action",
      range: "30 feet",
      components: "V",
      duration: "1 minute",
      description: "You can blind or deafen a foe. Choose one creature that you can see within range to make a Constitution saving throw. If it fails, the target is either blinded or deafened (your choice) for the duration. At the end of each of its turns, the target can make a Constitution saving throw. On a success, the spell ends.",
      higherLevel: "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd."
    },
    {
      name: "Calm Emotions",
      level: 2,
      school: "Enchantment",
      castingTime: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
      description: "You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw; a creature can choose to fail this saving throw if it wishes. If a creature fails its saving throw, choose one of the following two effects.",
      concentration: true
    },
    {
      name: "Enhance Ability",
      level: 2,
      school: "Transmutation",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S, M",
      duration: "Concentration, up to 1 hour",
      description: "You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains that effect until the spell ends.",
      concentration: true,
      higherLevel: "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd."
    },
    {
      name: "Hold Person",
      level: 2,
      school: "Enchantment",
      castingTime: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Concentration, up to 1 minute",
      description: "Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.",
      concentration: true,
      higherLevel: "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd. The humanoids must be within 30 feet of each other when you target them."
    },
    {
      name: "Lesser Restoration",
      level: 2,
      school: "Abjuration",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
      description: "You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned."
    },
    {
      name: "Locate Object",
      level: 2,
      school: "Divination",
      castingTime: "1 action",
      range: "Self",
      components: "V, S, M",
      duration: "Concentration, up to 10 minutes",
      description: "Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement.",
      concentration: true
    },
    {
      name: "Prayer of Healing",
      level: 2,
      school: "Evocation",
      castingTime: "10 minutes",
      range: "30 feet",
      components: "V",
      duration: "Instantaneous",
      description: "Up to six creatures of your choice that you can see within range each regain hit points equal to 2d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
      higherLevel: "When you cast this spell using a spell slot of 3rd level or higher, the healing increases by 1d8 for each slot level above 2nd."
    },
    {
      name: "Protection from Poison",
      level: 2,
      school: "Abjuration",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "1 hour",
      description: "You touch a creature. If it is poisoned, you neutralize the poison. If more than one poison afflicts the target, you neutralize one poison that you know is present, or you neutralize one at random. For the duration, the target has advantage on saving throws against being poisoned, and it has resistance to poison damage."
    },
    {
      name: "Silence",
      level: 2,
      school: "Illusion",
      castingTime: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Concentration, up to 10 minutes",
      description: "For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it.",
      concentration: true,
      ritual: true
    },
    {
      name: "Spiritual Weapon",
      level: 2,
      school: "Evocation",
      castingTime: "1 bonus action",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      description: "You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier.",
      higherLevel: "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for every two slot levels above 2nd."
    },
    {
      name: "Zone of Truth",
      level: 2,
      school: "Enchantment",
      castingTime: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "10 minutes",
      description: "You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell's area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius. You know whether each creature succeeds or fails on its saving throw."
    }
  ],
  level3: [
    {
      name: "Animate Dead",
      level: 3,
      school: "Necromancy",
      castingTime: "1 minute",
      range: "10 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "This spell creates an undead servant. Choose a pile of bones or a corpse of a Medium or Small humanoid within range. Your spell imbues the target with a foul mimicry of life, raising it as an undead creature. The target becomes a skeleton if you chose bones or a zombie if you chose a corpse (the DM has the creature's game statistics).",
      higherLevel: "When you cast this spell using a spell slot of 4th level or higher, you animate or reassert control over two additional undead creatures for each slot level above 3rd. Each of the creatures must come from a different corpse or pile of bones."
    },
    {
      name: "Beacon of Hope",
      level: 3,
      school: "Abjuration",
      castingTime: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
      description: "This spell bestows hope and vitality. Choose any number of creatures within range. For the duration, each target has advantage on Wisdom saving throws and death saving throws, and regains the maximum number of hit points possible from any healing.",
      concentration: true
    },
    {
      name: "Bestow Curse",
      level: 3,
      school: "Necromancy",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Concentration, up to 1 minute",
      description: "You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration of the spell. When you cast this spell, choose the nature of the curse from the following options.",
      concentration: true,
      higherLevel: "If you cast this spell using a spell slot of 4th level or higher, the duration is concentration, up to 10 minutes. If you use a spell slot of 5th level or higher, the duration is 8 hours. If you use a spell slot of 7th level or higher, the duration is 24 hours. If you use a 9th level spell slot, the spell lasts until it is dispelled. Using a spell slot of 5th level or higher grants a duration that doesn't require concentration."
    },
    {
      name: "Clairvoyance",
      level: 3,
      school: "Divination",
      castingTime: "10 minutes",
      range: "1 mile",
      components: "V, S, M",
      duration: "Concentration, up to 10 minutes",
      description: "You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The sensor remains in place for the duration, and it can't be attacked or otherwise interacted with.",
      concentration: true
    },
    {
      name: "Create Food and Water",
      level: 3,
      school: "Conjuration",
      castingTime: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "Instantaneous",
      description: "You create 45 pounds of food and 30 gallons of water on the ground or in containers within range, enough to sustain up to fifteen humanoids or five steeds for 24 hours. The food is bland but nourishing, and spoils if uneaten after 24 hours. The water is clean and doesn't go bad."
    },
    {
      name: "Daylight",
      level: 3,
      school: "Evocation",
      castingTime: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 hour",
      description: "A 60-foot-radius sphere of light spreads out from a point you choose within range. The sphere is bright light and sheds dim light for an additional 60 feet."
    },
    {
      name: "Dispel Magic",
      level: 3,
      school: "Abjuration",
      castingTime: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      description: "Choose any creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a successful check, the spell ends.",
      higherLevel: "When you cast this spell using a spell slot of 4th level or higher, you automatically end the effects of a spell on the target if the spell's level is equal to or less than the level of the spell slot you used."
    },
    {
      name: "Glyph of Warding",
      level: 3,
      school: "Abjuration",
      castingTime: "1 hour",
      range: "Touch",
      components: "V, S, M",
      duration: "Until dispelled or triggered",
      description: "When you cast this spell, you inscribe a glyph that harms other creatures, either upon a surface (such as a table or a section of floor or wall) or within an object that can be closed (such as a book, a scroll, or a treasure chest) to conceal the glyph.",
      higherLevel: "When you cast this spell using a spell slot of 4th level or higher, the damage of an explosive runes glyph increases by 1d8 for each slot level above 3rd. If you create a spell glyph, you can store any spell of up to the same level as the slot you use for the glyph of warding."
    },
    {
      name: "Magic Circle",
      level: 3,
      school: "Abjuration",
      castingTime: "1 minute",
      range: "10 feet",
      components: "V, S, M",
      duration: "1 hour",
      description: "You create a 10-foot-radius, 20-foot-tall cylinder of magical energy centered on a point on the ground that you can see within range. Glowing runes appear wherever the cylinder intersects with the floor or other surface."
    },
    {
      name: "Mass Healing Word",
      level: 3,
      school: "Evocation",
      castingTime: "1 bonus action",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      description: "As you call out words of restoration, up to six creatures of your choice that you can see within range regain hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
      higherLevel: "When you cast this spell using a spell slot of 4th level or higher, the healing increases by 1d4 for each slot level above 3rd."
    },
    {
      name: "Meld into Stone",
      level: 3,
      school: "Transmutation",
      castingTime: "1 action",
      range: "Self",
      components: "V, S",
      duration: "8 hours",
      description: "You step into a stone object or surface large enough to fully contain your body, melding yourself and all the equipment you carry with the stone for the duration. Using your movement, you step into the stone at a point you can touch. Nothing of your presence remains visible or otherwise detectable by nonmagical senses.",
      ritual: true
    },
    {
      name: "Protection from Energy",
      level: 3,
      school: "Abjuration",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Concentration, up to 1 hour",
      description: "For the duration, the willing creature you touch has resistance to one damage type of your choice: acid, cold, fire, lightning, or thunder.",
      concentration: true
    },
    {
      name: "Remove Curse",
      level: 3,
      school: "Abjuration",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
      description: "At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner's attunement to the object so it can be removed or discarded."
    },
    {
      name: "Revivify",
      level: 3,
      school: "Necromancy",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can't return to life a creature that has died of old age, nor can it restore any missing body parts."
    },
    {
      name: "Sending",
      level: 3,
      school: "Evocation",
      castingTime: "1 action",
      range: "Unlimited",
      components: "V, S, M",
      duration: "1 round",
      description: "You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately. The spell enables creatures with Intelligence scores of at least 1 to understand the meaning of your message."
    },
    {
      name: "Speak with Dead",
      level: 3,
      school: "Necromancy",
      castingTime: "1 action",
      range: "10 feet",
      components: "V, S, M",
      duration: "10 minutes",
      description: "You grant the semblance of life and intelligence to a corpse of your choice within range, allowing it to answer the questions you pose. The corpse must still have a mouth and can't be undead. The spell fails if the corpse was the target of this spell within the last 10 days."
    },
    {
      name: "Spirit Guardians",
      level: 3,
      school: "Conjuration",
      castingTime: "1 action",
      range: "Self (15-foot radius)",
      components: "V, S, M",
      duration: "Concentration, up to 10 minutes",
      description: "You call forth spirits to protect you. They flit around you to a distance of 15 feet for the duration. If you are good or neutral, their spectral form appears angelic or fey (your choice). If you are evil, they appear fiendish.",
      concentration: true,
      higherLevel: "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for every two slot levels above 3rd."
    },
    {
      name: "Tongues",
      level: 3,
      school: "Divination",
      castingTime: "1 action",
      range: "Touch",
      components: "V, M",
      duration: "1 hour",
      description: "This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says."
    },
    {
      name: "Water Walk",
      level: 3,
      school: "Transmutation",
      castingTime: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 hour",
      description: "This spell grants the ability to move across any liquid surface—such as water, acid, mud, snow, quicksand, or lava—as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures you can see within range gain this ability for the duration.",
      ritual: true
    }
  ],
  level4: [
    {
      name: "Banishment",
      level: 4,
      school: "Abjuration",
      castingTime: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Concentration, up to 1 minute",
      description: "You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished.",
      concentration: true,
      higherLevel: "When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th."
    },
    {
      name: "Control Water",
      level: 4,
      school: "Transmutation",
      castingTime: "1 action",
      range: "300 feet",
      components: "V, S, M",
      duration: "Concentration, up to 10 minutes",
      description: "Until the spell ends, you control any freestanding water inside an area you choose that is a cube up to 100 feet on a side. You can choose from any of the following effects when you cast this spell. As an action on your turn, you can repeat the same effect or choose a different one.",
      concentration: true
    },
    {
      name: "Cure Critical Wounds",
      level: 4,
      school: "Evocation",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
      description: "A creature you touch regains a number of hit points equal to 4d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
      higherLevel: "When you cast this spell using a spell slot of 5th level or higher, the healing increases by 1d8 for each slot level above 4th."
    },
    {
      name: "Death Ward",
      level: 4,
      school: "Abjuration",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "8 hours",
      description: "You touch a creature and grant it a measure of protection from death. The first time the target would drop to 0 hit points as a result of taking damage, the target instead drops to 1 hit point, and the spell ends. If the spell is still in effect when the target is subjected to an effect that would kill it instantaneously without dealing damage, that effect is instead negated against the target, and the spell ends."
    },
    {
      name: "Divination",
      level: 4,
      school: "Divination",
      castingTime: "1 action",
      range: "Self",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "Your magic and an offering put you in contact with a god or a god's servants. You ask a single question concerning a specific goal, event, or activity to occur within 7 days. The DM offers a truthful reply. The reply might be a short phrase, a cryptic rhyme, or an omen.",
      ritual: true
    },
    {
      name: "Freedom of Movement",
      level: 4,
      school: "Abjuration",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S, M",
      duration: "1 hour",
      description: "You touch a willing creature. For the duration, the target's movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target's speed nor cause the target to be paralyzed or restrained."
    },
    {
      name: "Guardian of Faith",
      level: 4,
      school: "Conjuration",
      castingTime: "1 action",
      range: "30 feet",
      components: "V",
      duration: "8 hours",
      description: "A Large spectral guardian appears and hovers for the duration in an unoccupied space of your choice that you can see within range. The guardian occupies that space and is indistinct except for a gleaming sword and shield emblazoned with the symbol of your deity."
    },
    {
      name: "Locate Creature",
      level: 4,
      school: "Divination",
      castingTime: "1 action",
      range: "Self",
      components: "V, S, M",
      duration: "Concentration, up to 1 hour",
      description: "Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement.",
      concentration: true
    },
    {
      name: "Polymorph",
      level: 4,
      school: "Transmutation",
      castingTime: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Concentration, up to 1 hour",
      description: "This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The spell has no effect on a shapechanger or a creature with 0 hit points.",
      concentration: true
    },
    {
      name: "Stone Shape",
      level: 4,
      school: "Transmutation",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose. So, for example, you could shape a large rock into a weapon, idol, or coffer, or make a small passage through a wall, as long as the wall is less than 5 feet thick."
    }
  ],
  level5: [
    {
      name: "Commune",
      level: 5,
      school: "Divination",
      castingTime: "1 minute",
      range: "Self",
      components: "V, S, M",
      duration: "1 minute",
      description: "You contact your deity or a divine proxy and ask up to three questions that can be answered with a yes or no. You must ask your questions before the spell ends. You receive a correct answer for each question unless the question concerns information that is beyond the deity's knowledge, in which case you receive 'unclear' as an answer.",
      ritual: true
    },
    {
      name: "Cure Critical Wounds",
      level: 5,
      school: "Evocation",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S",
      duration: "Instantaneous",
      description: "A creature you touch regains a number of hit points equal to 5d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs."
    },
    {
      name: "Dispel Evil and Good",
      level: 5,
      school: "Abjuration",
      castingTime: "1 action",
      range: "Self",
      components: "V, S, M",
      duration: "Concentration, up to 1 minute",
      description: "Shimmering energy surrounds and protects you from fey, undead, and creatures originating from beyond the Material Plane. For the duration, celestials, elementals, fey, fiends, and undead have disadvantage on attack rolls against you.",
      concentration: true
    },
    {
      name: "Flame Strike",
      level: 5,
      school: "Evocation",
      castingTime: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "A vertical column of divine fire roars down from the heavens in a location you specify. Each creature in a 10-foot-radius, 40-foot-high cylinder centered on a point within range must make a Dexterity saving throw. A creature takes 4d6 fire damage and 4d6 radiant damage on a failed save, or half as much damage on a successful one.",
      higherLevel: "When you cast this spell using a spell slot of 6th level or higher, the fire damage or the radiant damage (your choice) increases by 1d6 for each slot level above 5th."
    },
    {
      name: "Greater Restoration",
      level: 5,
      school: "Abjuration",
      castingTime: "1 action",
      range: "Touch",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "You imbue a creature you touch with positive energy to undo a debilitating effect. You can reduce the target's exhaustion level by one, or end one of the following effects on the target."
    },
    {
      name: "Hallow",
      level: 5,
      school: "Evocation",
      castingTime: "24 hours",
      range: "Touch",
      components: "V, S, M",
      duration: "Until dispelled",
      description: "You touch a point and infuse an area around it with holy (or unholy) power. The area can have a radius up to 60 feet, and the spell fails if the radius includes an area already under the effect a hallow spell. The affected area is subject to the following effects."
    },
    {
      name: "Insect Plague",
      level: 5,
      school: "Conjuration",
      castingTime: "1 action",
      range: "300 feet",
      components: "V, S, M",
      duration: "Concentration, up to 10 minutes",
      description: "Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere's area is difficult terrain.",
      concentration: true,
      higherLevel: "When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d10 for each slot level above 5th."
    },
    {
      name: "Mass Cure Wounds",
      level: 5,
      school: "Evocation",
      castingTime: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      description: "A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each target regains hit points equal to 3d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
      higherLevel: "When you cast this spell using a spell slot of 6th level or higher, the healing increases by 1d8 for each slot level above 5th."
    },
    {
      name: "Planar Binding",
      level: 5,
      school: "Abjuration",
      castingTime: "1 hour",
      range: "60 feet",
      components: "V, S, M",
      duration: "24 hours",
      description: "With this spell, you attempt to bind a celestial, an elemental, a fey, or a fiend to your service. The creature must be within range for the entire casting of the spell. (Typically, the creature is first summoned into the center of an inverted magic circle in order to keep it trapped while this spell is cast.)",
      higherLevel: "When you cast this spell using a spell slot of 6th level or higher, the duration increases to 10 days with a 6th-level slot, to 30 days with a 7th-level slot, to 180 days with an 8th-level slot, and to a year and a day with a 9th-level spell slot."
    },
    {
      name: "Raise Dead",
      level: 5,
      school: "Necromancy",
      castingTime: "1 hour",
      range: "Touch",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "You return a dead creature you touch to life, provided that it has been dead no longer than 10 days. If the creature's soul is both willing and at liberty to rejoin the body, the creature returns to life with 1 hit point."
    },
    {
      name: "Scrying",
      level: 5,
      school: "Divination",
      castingTime: "10 minutes",
      range: "Self",
      components: "V, S, M",
      duration: "Concentration, up to 10 minutes",
      description: "You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it.",
      concentration: true
    }
  ],
  level6: [],
  level7: [],
  level8: [],
  level9: []
};