import { Weapon, WeaponProperty } from './types/equipment.js';

/**
 * Comprehensive D&D 5e Weapons Database
 * This includes all weapons from the Player's Handbook plus additional weapons from supplements
 */

export const COMPREHENSIVE_WEAPONS = [
  // ===== SIMPLE MELEE WEAPONS =====
  {
    id: 'club',
    name: 'Club',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 4, type: 'bludgeoning' },
    properties: ['light'],
    weight: 2,
    cost: 10, // 1 sp
    description: 'A simple wooden club.',
    proficiencyRequired: false
  },
  {
    id: 'dagger',
    name: 'Dagger',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 4, type: 'piercing' },
    properties: ['finesse', 'light', 'thrown'],
    range: { normal: 20, long: 60 },
    weight: 1,
    cost: 200, // 2 gp
    description: 'A short, sharp blade.',
    proficiencyRequired: false
  },
  {
    id: 'greatclub',
    name: 'Greatclub',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 8, type: 'bludgeoning' },
    properties: ['two-handed'],
    weight: 10,
    cost: 20, // 2 sp
    description: 'A large, heavy club.',
    proficiencyRequired: false
  },
  {
    id: 'handaxe',
    name: 'Handaxe',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 6, type: 'slashing' },
    properties: ['light', 'thrown'],
    range: { normal: 20, long: 60 },
    weight: 2,
    cost: 500, // 5 gp
    description: 'A small, one-handed axe.',
    proficiencyRequired: false
  },
  {
    id: 'javelin',
    name: 'Javelin',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 6, type: 'piercing' },
    properties: ['thrown'],
    range: { normal: 30, long: 120 },
    weight: 2,
    cost: 50, // 5 sp
    description: 'A light spear designed for throwing.',
    proficiencyRequired: false
  },
  {
    id: 'light_hammer',
    name: 'Light Hammer',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 4, type: 'bludgeoning' },
    properties: ['light', 'thrown'],
    range: { normal: 20, long: 60 },
    weight: 2,
    cost: 200, // 2 gp
    description: 'A small, one-handed hammer.',
    proficiencyRequired: false
  },
  {
    id: 'mace',
    name: 'Mace',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 6, type: 'bludgeoning' },
    properties: [],
    weight: 4,
    cost: 500, // 5 gp
    description: 'A heavy club with a metal head.',
    proficiencyRequired: false
  },
  {
    id: 'quarterstaff',
    name: 'Quarterstaff',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 6, type: 'bludgeoning' },
    properties: ['versatile'],
    weight: 4,
    cost: 20, // 2 sp
    description: 'A long wooden staff.',
    proficiencyRequired: false
  },
  {
    id: 'sickle',
    name: 'Sickle',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 4, type: 'slashing' },
    properties: ['light'],
    weight: 2,
    cost: 100, // 1 gp
    description: 'A curved blade on a short handle.',
    proficiencyRequired: false
  },
  {
    id: 'spear',
    name: 'Spear',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 6, type: 'piercing' },
    properties: ['thrown', 'versatile'],
    range: { normal: 20, long: 60 },
    weight: 3,
    cost: 100, // 1 gp
    description: 'A long wooden shaft with a pointed metal head.',
    proficiencyRequired: false
  },

  // ===== SIMPLE RANGED WEAPONS =====
  {
    id: 'crossbow_light',
    name: 'Light Crossbow',
    type: 'ranged',
    category: 'simple',
    damage: { dice: 1, sides: 8, type: 'piercing' },
    properties: ['ammunition', 'loading', 'two-handed'],
    range: { normal: 80, long: 320 },
    weight: 5,
    cost: 2500, // 25 gp
    description: 'A small, easy-to-use crossbow.',
    proficiencyRequired: false
  },
  {
    id: 'dart',
    name: 'Dart',
    type: 'ranged',
    category: 'simple',
    damage: { dice: 1, sides: 4, type: 'piercing' },
    properties: ['finesse', 'thrown'],
    range: { normal: 20, long: 60 },
    weight: 0.25,
    cost: 5, // 5 cp
    description: 'A small, pointed projectile.',
    proficiencyRequired: false
  },
  {
    id: 'shortbow',
    name: 'Shortbow',
    type: 'ranged',
    category: 'simple',
    damage: { dice: 1, sides: 6, type: 'piercing' },
    properties: ['ammunition', 'two-handed'],
    range: { normal: 80, long: 320 },
    weight: 2,
    cost: 2500, // 25 gp
    description: 'A short, curved bow.',
    proficiencyRequired: false
  },
  {
    id: 'sling',
    name: 'Sling',
    type: 'ranged',
    category: 'simple',
    damage: { dice: 1, sides: 4, type: 'bludgeoning' },
    properties: ['ammunition'],
    range: { normal: 30, long: 120 },
    weight: 0,
    cost: 10, // 1 sp
    description: 'A simple leather strap for hurling stones.',
    proficiencyRequired: false
  },

  // ===== MARTIAL MELEE WEAPONS =====
  {
    id: 'battleaxe',
    name: 'Battleaxe',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 8, type: 'slashing' },
    properties: ['versatile'],
    weight: 4,
    cost: 1000, // 10 gp
    description: 'A heavy axe designed for combat.',
    proficiencyRequired: true
  },
  {
    id: 'flail',
    name: 'Flail',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 8, type: 'bludgeoning' },
    properties: [],
    weight: 2,
    cost: 1000, // 10 gp
    description: 'A spiked ball on a chain.',
    proficiencyRequired: true
  },
  {
    id: 'glaive',
    name: 'Glaive',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 10, type: 'slashing' },
    properties: ['heavy', 'reach', 'two-handed'],
    weight: 6,
    cost: 2000, // 20 gp
    description: 'A long polearm with a curved blade.',
    proficiencyRequired: true
  },
  {
    id: 'greataxe',
    name: 'Greataxe',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 12, type: 'slashing' },
    properties: ['heavy', 'two-handed'],
    weight: 7,
    cost: 3000, // 30 gp
    description: 'A massive two-handed axe.',
    proficiencyRequired: true
  },
  {
    id: 'greatsword',
    name: 'Greatsword',
    type: 'melee',
    category: 'martial',
    damage: { dice: 2, sides: 6, type: 'slashing' },
    properties: ['heavy', 'two-handed'],
    weight: 6,
    cost: 5000, // 50 gp
    description: 'A massive two-handed sword.',
    proficiencyRequired: true
  },
  {
    id: 'halberd',
    name: 'Halberd',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 10, type: 'slashing' },
    properties: ['heavy', 'reach', 'two-handed'],
    weight: 6,
    cost: 2000, // 20 gp
    description: 'A long polearm with an axe blade and spear point.',
    proficiencyRequired: true
  },
  {
    id: 'lance',
    name: 'Lance',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 12, type: 'piercing' },
    properties: ['reach', 'special'],
    weight: 6,
    cost: 1000, // 10 gp
    description: 'A long spear designed for mounted combat.',
    proficiencyRequired: true
  },
  {
    id: 'longsword',
    name: 'Longsword',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 8, type: 'slashing' },
    properties: ['versatile'],
    weight: 3,
    cost: 1500, // 15 gp
    description: 'A versatile one-handed sword.',
    proficiencyRequired: true
  },
  {
    id: 'maul',
    name: 'Maul',
    type: 'melee',
    category: 'martial',
    damage: { dice: 2, sides: 6, type: 'bludgeoning' },
    properties: ['heavy', 'two-handed'],
    weight: 10,
    cost: 1000, // 10 gp
    description: 'A massive two-handed hammer.',
    proficiencyRequired: true
  },
  {
    id: 'morningstar',
    name: 'Morningstar',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 8, type: 'piercing' },
    properties: [],
    weight: 4,
    cost: 1500, // 15 gp
    description: 'A spiked ball on a handle.',
    proficiencyRequired: true
  },
  {
    id: 'pike',
    name: 'Pike',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 10, type: 'piercing' },
    properties: ['heavy', 'reach', 'two-handed'],
    weight: 18,
    cost: 500, // 5 gp
    description: 'A very long spear.',
    proficiencyRequired: true
  },
  {
    id: 'rapier',
    name: 'Rapier',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 8, type: 'piercing' },
    properties: ['finesse'],
    weight: 2,
    cost: 2500, // 25 gp
    description: 'A thin, flexible sword designed for thrusting.',
    proficiencyRequired: true
  },
  {
    id: 'scimitar',
    name: 'Scimitar',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 6, type: 'slashing' },
    properties: ['finesse', 'light'],
    weight: 3,
    cost: 2500, // 25 gp
    description: 'A curved, single-edged sword.',
    proficiencyRequired: true
  },
  {
    id: 'shortsword',
    name: 'Shortsword',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 6, type: 'piercing' },
    properties: ['finesse', 'light'],
    weight: 2,
    cost: 1000, // 10 gp
    description: 'A short, light sword.',
    proficiencyRequired: true
  },
  {
    id: 'trident',
    name: 'Trident',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 6, type: 'piercing' },
    properties: ['thrown', 'versatile'],
    range: { normal: 20, long: 60 },
    weight: 4,
    cost: 500, // 5 gp
    description: 'A three-pronged spear.',
    proficiencyRequired: true
  },
  {
    id: 'war_pick',
    name: 'War Pick',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 8, type: 'piercing' },
    properties: [],
    weight: 2,
    cost: 500, // 5 gp
    description: 'A pick designed for combat.',
    proficiencyRequired: true
  },
  {
    id: 'warhammer',
    name: 'Warhammer',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 8, type: 'bludgeoning' },
    properties: ['versatile'],
    weight: 2,
    cost: 1500, // 15 gp
    description: 'A hammer designed for combat.',
    proficiencyRequired: true
  },
  {
    id: 'whip',
    name: 'Whip',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 4, type: 'slashing' },
    properties: ['finesse', 'reach'],
    weight: 3,
    cost: 200, // 2 gp,
    description: 'A long, flexible weapon.',
    proficiencyRequired: true
  },

  // ===== MARTIAL RANGED WEAPONS =====
  {
    id: 'blowgun',
    name: 'Blowgun',
    type: 'ranged',
    category: 'martial',
    damage: { dice: 1, sides: 1, type: 'piercing' },
    properties: ['ammunition', 'loading'],
    range: { normal: 25, long: 100 },
    weight: 1,
    cost: 1000, // 10 gp
    description: 'A tube for blowing darts.',
    proficiencyRequired: true
  },
  {
    id: 'crossbow_hand',
    name: 'Hand Crossbow',
    type: 'ranged',
    category: 'martial',
    damage: { dice: 1, sides: 6, type: 'piercing' },
    properties: ['ammunition', 'light', 'loading'],
    range: { normal: 30, long: 120 },
    weight: 3,
    cost: 7500, // 75 gp
    description: 'A small, one-handed crossbow.',
    proficiencyRequired: true
  },
  {
    id: 'crossbow_heavy',
    name: 'Heavy Crossbow',
    type: 'ranged',
    category: 'martial',
    damage: { dice: 1, sides: 10, type: 'piercing' },
    properties: ['ammunition', 'heavy', 'loading', 'two-handed'],
    range: { normal: 100, long: 400 },
    weight: 18,
    cost: 5000, // 50 gp
    description: 'A large, powerful crossbow.',
    proficiencyRequired: true
  },
  {
    id: 'longbow',
    name: 'Longbow',
    type: 'ranged',
    category: 'martial',
    damage: { dice: 1, sides: 8, type: 'piercing' },
    properties: ['ammunition', 'heavy', 'two-handed'],
    range: { normal: 150, long: 600 },
    weight: 2,
    cost: 5000, // 50 gp
    description: 'A long, powerful bow.',
    proficiencyRequired: true
  },
  {
    id: 'net',
    name: 'Net',
    type: 'ranged',
    category: 'martial',
    damage: { dice: 0, sides: 0, type: 'bludgeoning' },
    properties: ['special', 'thrown'],
    range: { normal: 5, long: 15 },
    weight: 3,
    cost: 100, // 1 gp
    description: 'A net for restraining enemies.',
    proficiencyRequired: true
  },

  // ===== ADDITIONAL WEAPONS FROM SUPPLEMENTS =====
  
  // From Eberron: Rising from the Last War
  {
    id: 'double_bladed_scimitar',
    name: 'Double-Bladed Scimitar',
    type: 'melee',
    category: 'martial',
    damage: { dice: 2, sides: 4, type: 'slashing' },
    properties: ['two-handed', 'special'],
    weight: 6,
    cost: 10000, // 100 gp
    description: 'A weapon with blades on both ends of a long handle.',
    proficiencyRequired: true
  },
  {
    id: 'yklwa',
    name: 'Yklwa',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 8, type: 'piercing' },
    properties: ['thrown'],
    range: { normal: 10, long: 30 },
    weight: 2,
    cost: 100, // 1 gp
    description: 'A short spear with a broad, flat blade.',
    proficiencyRequired: false
  },
  {
    id: 'boomerang',
    name: 'Boomerang',
    type: 'ranged',
    category: 'simple',
    damage: { dice: 1, sides: 4, type: 'bludgeoning' },
    properties: ['thrown'],
    range: { normal: 60, long: 120 },
    weight: 2,
    cost: 50, // 5 sp
    description: 'A curved throwing weapon that returns to the thrower.',
    proficiencyRequired: false
  },
  {
    id: 'sling_staff',
    name: 'Sling Staff',
    type: 'ranged',
    category: 'martial',
    damage: { dice: 1, sides: 6, type: 'bludgeoning' },
    properties: ['ammunition', 'two-handed'],
    range: { normal: 30, long: 120 },
    weight: 4,
    cost: 200, // 2 gp
    description: 'A sling mounted on a staff for increased range and power.',
    proficiencyRequired: true
  },
  {
    id: 'whip_dagger',
    name: 'Whip Dagger',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 4, type: 'slashing' },
    properties: ['finesse', 'reach', 'thrown'],
    range: { normal: 10, long: 30 },
    weight: 2,
    cost: 500, // 5 gp
    description: 'A dagger attached to a flexible cord.',
    proficiencyRequired: true
  },

  // From Tasha's Cauldron of Everything
  {
    id: 'blowgun_needle',
    name: 'Blowgun Needle',
    type: 'ranged',
    category: 'simple',
    damage: { dice: 1, sides: 1, type: 'piercing' },
    properties: ['ammunition', 'loading'],
    range: { normal: 25, long: 100 },
    weight: 1,
    cost: 200, // 2 gp
    description: 'A small tube for shooting needles.',
    proficiencyRequired: false
  },

  // From Fizban's Treasury of Dragons
  {
    id: 'dragon_scale_weapon',
    name: 'Dragon Scale Weapon',
    type: 'melee',
    category: 'martial',
    damage: { dice: 1, sides: 8, type: 'slashing' },
    properties: ['versatile', 'magical'],
    weight: 3,
    cost: 50000, // 500 gp
    description: 'A weapon crafted from dragon scales with magical properties.',
    proficiencyRequired: true
  },

  // ===== IMPROVISED WEAPONS =====
  {
    id: 'improvised_weapon',
    name: 'Improvised Weapon',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 4, type: 'bludgeoning' },
    properties: ['improvised'],
    weight: 1,
    cost: 0,
    description: 'Any object used as a weapon.',
    proficiencyRequired: false
  },

  // ===== UNARMED STRIKES =====
  {
    id: 'unarmed_strike',
    name: 'Unarmed Strike',
    type: 'melee',
    category: 'simple',
    damage: { dice: 1, sides: 1, type: 'bludgeoning' },
    properties: [],
    weight: 0,
    cost: 0,
    description: 'A punch, kick, or other unarmed attack.',
    proficiencyRequired: false
  }
] as const satisfies readonly Weapon[];

/**
 * Weapon categories for easy filtering
 */
export const WEAPON_CATEGORIES = {
  SIMPLE_MELEE: 'simple_melee',
  SIMPLE_RANGED: 'simple_ranged',
  MARTIAL_MELEE: 'martial_melee',
  MARTIAL_RANGED: 'martial_ranged',
  EXOTIC: 'exotic',
  IMPROVISED: 'improvised'
} as const;

/**
 * Weapon properties for easy reference
 */
export const WEAPON_PROPERTIES = {
  AMMUNITION: 'ammunition',
  FINESSE: 'finesse',
  HEAVY: 'heavy',
  LIGHT: 'light',
  LOADING: 'loading',
  REACH: 'reach',
  SPECIAL: 'special',
  THROWN: 'thrown',
  TWO_HANDED: 'two-handed',
  VERSATILE: 'versatile',
  IMPROVISED: 'improvised',
  SILVERED: 'silvered',
  MAGICAL: 'magical'
} as const;

/**
 * Damage types for easy reference
 */
export const DAMAGE_TYPES = {
  BLUDGEONING: 'bludgeoning',
  PIERCING: 'piercing',
  SLASHING: 'slashing',
  FIRE: 'fire',
  COLD: 'cold',
  LIGHTNING: 'lightning',
  ACID: 'acid',
  THUNDER: 'thunder',
  FORCE: 'force',
  NECROTIC: 'necrotic',
  RADIANT: 'radiant',
  PSYCHIC: 'psychic'
} as const;

/**
 * Helper functions for working with weapons
 */
export class WeaponHelper {
  /**
   * Get all weapons of a specific category
   */
  static getWeaponsByCategory(category: 'simple' | 'martial' | 'exotic'): Weapon[] {
    return COMPREHENSIVE_WEAPONS.filter(weapon => weapon.category === category);
  }

  /**
   * Get all weapons of a specific type (melee or ranged)
   */
  static getWeaponsByType(type: 'melee' | 'ranged'): Weapon[] {
    return COMPREHENSIVE_WEAPONS.filter(weapon => weapon.type === type);
  }

  /**
   * Get weapons with specific properties
   */
  static getWeaponsByProperty(property: WeaponProperty): Weapon[] {
    return COMPREHENSIVE_WEAPONS.filter(weapon => (weapon.properties as WeaponProperty[]).includes(property));
  }

  /**
   * Get weapons by damage type
   */
  static getWeaponsByDamageType(damageType: string): Weapon[] {
    return COMPREHENSIVE_WEAPONS.filter(weapon => weapon.damage.type === damageType);
  }

  /**
   * Get weapons within a specific cost range
   */
  static getWeaponsByCostRange(minCost: number, maxCost: number): Weapon[] {
    return COMPREHENSIVE_WEAPONS.filter(weapon => weapon.cost >= minCost && weapon.cost <= maxCost);
  }

  /**
   * Get weapons within a specific weight range
   */
  static getWeaponsByWeightRange(minWeight: number, maxWeight: number): Weapon[] {
    return COMPREHENSIVE_WEAPONS.filter(weapon => weapon.weight >= minWeight && weapon.weight <= maxWeight);
  }

  /**
   * Search weapons by name
   */
  static searchWeaponsByName(searchTerm: string): Weapon[] {
    const term = searchTerm.toLowerCase();
    return COMPREHENSIVE_WEAPONS.filter(weapon => 
      weapon.name.toLowerCase().includes(term)
    );
  }

  /**
   * Get weapon by ID
   */
  static getWeaponById(id: string): Weapon | undefined {
    return COMPREHENSIVE_WEAPONS.find(weapon => weapon.id === id);
  }

  /**
   * Get all unique weapon properties
   */
  static getAllProperties(): string[] {
    const properties = new Set<string>();
    COMPREHENSIVE_WEAPONS.forEach(weapon => {
      weapon.properties.forEach(prop => properties.add(prop));
    });
    return Array.from(properties).sort();
  }

  /**
   * Get all unique damage types
   */
  static getAllDamageTypes(): string[] {
    const damageTypes = new Set<string>();
    COMPREHENSIVE_WEAPONS.forEach(weapon => {
      damageTypes.add(weapon.damage.type);
    });
    return Array.from(damageTypes).sort();
  }

  /**
   * Calculate average damage for a weapon
   */
  static getAverageDamage(weapon: Weapon): number {
    return (weapon.damage.dice * (weapon.damage.sides + 1)) / 2;
  }

  /**
   * Get weapons sorted by damage (highest first)
   */
  static getWeaponsByDamage(): Weapon[] {
    return [...COMPREHENSIVE_WEAPONS].sort((a, b) => 
      this.getAverageDamage(b) - this.getAverageDamage(a)
    );
  }

  /**
   * Get weapons sorted by cost (lowest first)
   */
  static getWeaponsByCost(): Weapon[] {
    return [...COMPREHENSIVE_WEAPONS].sort((a, b) => a.cost - b.cost);
  }
}

export default COMPREHENSIVE_WEAPONS;


