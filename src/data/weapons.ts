import { Weapon } from '../types/equipment';

export const WEAPONS: Weapon[] = [
  // Simple Melee Weapons
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

  // Simple Ranged Weapons
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

  // Martial Melee Weapons
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
    cost: 200, // 2 gp
    description: 'A long, flexible weapon.',
    proficiencyRequired: true
  },

  // Martial Ranged Weapons
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
  }
];
