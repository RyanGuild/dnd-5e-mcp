export interface Weapon {
  id: string;
  name: string;
  type: 'melee' | 'ranged';
  category: 'simple' | 'martial' | 'exotic';
  damage: {
    dice: number;
    sides: number;
    type: 'bludgeoning' | 'piercing' | 'slashing' | 'fire' | 'cold' | 'lightning' | 'acid' | 'thunder' | 'force' | 'necrotic' | 'radiant' | 'psychic';
  };
  properties: WeaponProperty[];
  range?: {
    normal: number;
    long: number;
  };
  weight: number; // in pounds
  cost: number; // in copper pieces
  description: string;
  proficiencyRequired: boolean;
}

export interface Armor {
  id: string;
  name: string;
  type: 'light' | 'medium' | 'heavy' | 'shield';
  ac: number;
  acBonus?: number; // for shields
  dexBonus?: 'none' | 'limited' | 'unlimited';
  strengthRequirement?: number;
  stealthDisadvantage: boolean;
  weight: number; // in pounds
  cost: number; // in copper pieces
  description: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'tool' | 'gear' | 'consumable' | 'wondrous' | 'other';
  weight: number; // in pounds
  cost: number; // in copper pieces
  description: string;
  properties?: string[];
}

export interface InventoryItem {
  id: string;
  item: Weapon | Armor | Equipment;
  quantity: number;
  equipped: boolean;
  notes?: string;
}

export type WeaponProperty = 
  | 'ammunition'
  | 'finesse'
  | 'heavy'
  | 'light'
  | 'loading'
  | 'reach'
  | 'special'
  | 'thrown'
  | 'two-handed'
  | 'versatile'
  | 'improvised'
  | 'silvered'
  | 'magical';

export interface CharacterInventory {
  items: InventoryItem[];
  maxWeight: number; // in pounds
  currentWeight: number; // in pounds
  currency: {
    copper: number;
    silver: number;
    gold: number;
    platinum: number;
  };
}

export interface EquipmentStats {
  armorClass: number;
  attackBonus: number;
  damageBonus: number;
  speedModifier: number;
  stealthDisadvantage: boolean;
  strengthRequirement: number;
}
