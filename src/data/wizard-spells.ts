import { Spellbook } from '../utils/spells';

// Popular Wizard Spells Database
export const WIZARD_SPELLS: Spellbook = {
  cantrips: [
    {
      name: "Fire Bolt",
      level: 0,
      school: "Evocation",
      castingTime: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      description: "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried."
    },
    {
      name: "Mage Hand",
      level: 0,
      school: "Conjuration",
      castingTime: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "1 minute",
      description: "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand can manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial."
    },
    {
      name: "Minor Illusion",
      level: 0,
      school: "Illusion",
      castingTime: "1 action",
      range: "30 feet",
      components: "S, M",
      duration: "1 minute",
      description: "You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again."
    },
    {
      name: "Prestidigitation",
      level: 0,
      school: "Transmutation",
      castingTime: "1 action",
      range: "10 feet",
      components: "V, S",
      duration: "Up to 1 hour",
      description: "This spell is a minor magical trick that novice spellcasters use for practice. You create one of several magical effects within range."
    }
  ],
  level1: [
    {
      name: "Magic Missile",
      level: 1,
      school: "Evocation",
      castingTime: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      description: "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4+1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.",
      higherLevel: "When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st."
    },
    {
      name: "Shield",
      level: 1,
      school: "Abjuration",
      castingTime: "1 reaction",
      range: "Self",
      components: "V, S",
      duration: "1 round",
      description: "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile."
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
      name: "Identify",
      level: 1,
      school: "Divination",
      castingTime: "1 minute",
      range: "Touch",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "You choose one object that you must touch throughout the casting of the spell. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any.",
      ritual: true
    }
  ],
  level2: [
    {
      name: "Misty Step",
      level: 2,
      school: "Conjuration",
      castingTime: "1 bonus action",
      range: "Self",
      components: "V",
      duration: "Instantaneous",
      description: "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see."
    },
    {
      name: "Scorching Ray",
      level: 2,
      school: "Evocation",
      castingTime: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      description: "You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.",
      higherLevel: "When you cast this spell using a spell slot of 3rd level or higher, you create one additional ray for each slot level above 2nd."
    },
    {
      name: "Suggestion",
      level: 2,
      school: "Enchantment",
      castingTime: "1 action",
      range: "30 feet",
      components: "V, M",
      duration: "Concentration, up to 8 hours",
      description: "You suggest a course of activity (limited to a sentence or two) and magically influence a creature you can see within range that can hear and understand you. Creatures that can't be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of action sound reasonable.",
      concentration: true
    }
  ],
  level3: [
    {
      name: "Fireball",
      level: 3,
      school: "Evocation",
      castingTime: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      description: "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.",
      higherLevel: "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd."
    },
    {
      name: "Counterspell",
      level: 3,
      school: "Abjuration",
      castingTime: "1 reaction",
      range: "60 feet",
      components: "S",
      duration: "Instantaneous",
      description: "You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect."
    },
    {
      name: "Dispel Magic",
      level: 3,
      school: "Abjuration",
      castingTime: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      description: "Choose any creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a successful check, the spell ends."
    }
  ],
  level4: [],
  level5: [],
  level6: [],
  level7: [],
  level8: [],
  level9: []
};
