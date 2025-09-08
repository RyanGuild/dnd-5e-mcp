import { Armor } from '../types/equipment.js';

export const ARMOR: Armor[] = [
  // Light Armor
  {
    id: 'padded',
    name: 'Padded Armor',
    type: 'light',
    ac: 11,
    dexBonus: 'unlimited',
    stealthDisadvantage: false,
    weight: 8,
    cost: 500, // 5 gp
    description: 'Quilted layers of cloth and batting.'
  },
  {
    id: 'leather',
    name: 'Leather Armor',
    type: 'light',
    ac: 11,
    dexBonus: 'unlimited',
    stealthDisadvantage: false,
    weight: 10,
    cost: 1000, // 10 gp
    description: 'The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil.'
  },
  {
    id: 'studded_leather',
    name: 'Studded Leather Armor',
    type: 'light',
    ac: 12,
    dexBonus: 'unlimited',
    stealthDisadvantage: false,
    weight: 13,
    cost: 4500, // 45 gp
    description: 'Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.'
  },

  // Medium Armor
  {
    id: 'hide',
    name: 'Hide Armor',
    type: 'medium',
    ac: 12,
    dexBonus: 'limited',
    stealthDisadvantage: false,
    weight: 12,
    cost: 1000, // 10 gp
    description: 'This crude armor consists of thick furs and pelts.'
  },
  {
    id: 'chain_shirt',
    name: 'Chain Shirt',
    type: 'medium',
    ac: 13,
    dexBonus: 'limited',
    stealthDisadvantage: false,
    weight: 20,
    cost: 5000, // 50 gp
    description: 'Made of interlocking metal rings, a chain shirt is worn between layers of clothing or leather.'
  },
  {
    id: 'scale_mail',
    name: 'Scale Mail',
    type: 'medium',
    ac: 14,
    dexBonus: 'limited',
    stealthDisadvantage: true,
    weight: 45,
    cost: 5000, // 50 gp
    description: 'This armor consists of a coat and leggings (and perhaps a separate skirt) of leather covered with overlapping pieces of metal.'
  },
  {
    id: 'breastplate',
    name: 'Breastplate',
    type: 'medium',
    ac: 14,
    dexBonus: 'limited',
    stealthDisadvantage: false,
    weight: 20,
    cost: 40000, // 400 gp
    description: 'This armor consists of a fitted metal chest piece worn with supple leather.'
  },
  {
    id: 'half_plate',
    name: 'Half Plate',
    type: 'medium',
    ac: 15,
    dexBonus: 'limited',
    stealthDisadvantage: true,
    weight: 40,
    cost: 75000, // 750 gp
    description: 'Half plate consists of shaped metal plates that cover most of the wearer\'s body.'
  },

  // Heavy Armor
  {
    id: 'ring_mail',
    name: 'Ring Mail',
    type: 'heavy',
    ac: 14,
    dexBonus: 'none',
    stealthDisadvantage: true,
    weight: 40,
    cost: 3000, // 30 gp
    description: 'This armor is leather armor with heavy rings sewn into it.'
  },
  {
    id: 'chain_mail',
    name: 'Chain Mail',
    type: 'heavy',
    ac: 16,
    dexBonus: 'none',
    strengthRequirement: 13,
    stealthDisadvantage: true,
    weight: 55,
    cost: 7500, // 75 gp
    description: 'Made of interlocking metal rings, chain mail includes a layer of quilted fabric worn underneath the mail to prevent chafing and to cushion the impact of blows.'
  },
  {
    id: 'splint',
    name: 'Splint Armor',
    type: 'heavy',
    ac: 17,
    dexBonus: 'none',
    strengthRequirement: 15,
    stealthDisadvantage: true,
    weight: 60,
    cost: 20000, // 200 gp
    description: 'This armor is made of narrow vertical strips of metal riveted to a backing of leather that is worn over cloth padding.'
  },
  {
    id: 'plate',
    name: 'Plate Armor',
    type: 'heavy',
    ac: 18,
    dexBonus: 'none',
    strengthRequirement: 15,
    stealthDisadvantage: true,
    weight: 65,
    cost: 150000, // 1500 gp
    description: 'Plate consists of shaped, interlocking metal plates to cover the entire body.'
  },

  // Shields
  {
    id: 'shield',
    name: 'Shield',
    type: 'shield',
    ac: 2,
    acBonus: 2,
    stealthDisadvantage: false,
    weight: 6,
    cost: 1000, // 10 gp
    description: 'A shield is made from wood or metal and is carried in one hand.'
  }
];
