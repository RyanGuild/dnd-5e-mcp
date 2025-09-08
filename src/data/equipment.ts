import { Equipment } from '../types/equipment';

export const EQUIPMENT: Equipment[] = [
  // Adventuring Gear
  {
    id: 'backpack',
    name: 'Backpack',
    type: 'gear',
    weight: 5,
    cost: 200, // 2 gp
    description: 'A leather pack with straps to secure it to your back.'
  },
  {
    id: 'bedroll',
    name: 'Bedroll',
    type: 'gear',
    weight: 7,
    cost: 100, // 1 gp
    description: 'A sleeping bag and blanket rolled together.'
  },
  {
    id: 'crowbar',
    name: 'Crowbar',
    type: 'tool',
    weight: 5,
    cost: 200, // 2 gp
    description: 'A metal bar with a flattened end, used for prying.'
  },
  {
    id: 'hammer',
    name: 'Hammer',
    type: 'tool',
    weight: 3,
    cost: 200, // 2 gp
    description: 'A tool for driving nails and other tasks.'
  },
  {
    id: 'lantern_bullseye',
    name: 'Bullseye Lantern',
    type: 'gear',
    weight: 2,
    cost: 1000, // 10 gp
    description: 'A hooded lantern that casts bright light in a 60-foot cone.'
  },
  {
    id: 'lantern_hooded',
    name: 'Hooded Lantern',
    type: 'gear',
    weight: 2,
    cost: 500, // 5 gp
    description: 'A lantern that casts bright light in a 30-foot radius.'
  },
  {
    id: 'oil_flask',
    name: 'Oil (flask)',
    type: 'consumable',
    weight: 1,
    cost: 10, // 1 sp
    description: 'Oil usually comes in a clay flask that holds 1 pint.'
  },
  {
    id: 'piton',
    name: 'Piton',
    type: 'gear',
    weight: 0.25,
    cost: 5, // 5 cp
    description: 'A metal spike used for climbing.'
  },
  {
    id: 'rope_hempen',
    name: 'Rope, hempen (50 feet)',
    type: 'gear',
    weight: 10,
    cost: 200, // 2 gp
    description: 'Rope, whether made of hemp or silk, has 2 hit points and can be burst with a DC 17 Strength check.'
  },
  {
    id: 'rope_silk',
    name: 'Rope, silk (50 feet)',
    type: 'gear',
    weight: 5,
    cost: 1000, // 10 gp
    description: 'Rope, whether made of hemp or silk, has 2 hit points and can be burst with a DC 17 Strength check.'
  },
  {
    id: 'tinderbox',
    name: 'Tinderbox',
    type: 'gear',
    weight: 1,
    cost: 50, // 5 sp
    description: 'This small container holds flint, fire steel, and tinder (usually dry cloth soaked in light oil) used to kindle a fire.'
  },
  {
    id: 'torch',
    name: 'Torch',
    type: 'gear',
    weight: 1,
    cost: 1, // 1 cp
    description: 'A torch burns for 1 hour, providing bright light in a 20-foot radius.'
  },
  {
    id: 'waterskin',
    name: 'Waterskin',
    type: 'gear',
    weight: 5,
    cost: 20, // 2 sp
    description: 'A leather pouch that can hold 4 pints of liquid.'
  },

  // Tools
  {
    id: 'alchemists_supplies',
    name: 'Alchemist\'s Supplies',
    type: 'tool',
    weight: 8,
    cost: 5000, // 50 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'brewers_supplies',
    name: 'Brewer\'s Supplies',
    type: 'tool',
    weight: 9,
    cost: 2000, // 20 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'calligraphers_supplies',
    name: 'Calligrapher\'s Supplies',
    type: 'tool',
    weight: 5,
    cost: 1000, // 10 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'carpenters_tools',
    name: 'Carpenter\'s Tools',
    type: 'tool',
    weight: 6,
    cost: 800, // 8 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'cartographers_tools',
    name: 'Cartographer\'s Tools',
    type: 'tool',
    weight: 6,
    cost: 1500, // 15 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'cobblers_tools',
    name: 'Cobbler\'s Tools',
    type: 'tool',
    weight: 5,
    cost: 500, // 5 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'cooks_utensils',
    name: 'Cook\'s Utensils',
    type: 'tool',
    weight: 8,
    cost: 100, // 1 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'glassblowers_tools',
    name: 'Glassblower\'s Tools',
    type: 'tool',
    weight: 5,
    cost: 3000, // 30 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'jewelers_tools',
    name: 'Jeweler\'s Tools',
    type: 'tool',
    weight: 2,
    cost: 2500, // 25 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'leatherworkers_tools',
    name: 'Leatherworker\'s Tools',
    type: 'tool',
    weight: 5,
    cost: 500, // 5 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'masons_tools',
    name: 'Mason\'s Tools',
    type: 'tool',
    weight: 8,
    cost: 1000, // 10 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'painters_supplies',
    name: 'Painter\'s Supplies',
    type: 'tool',
    weight: 5,
    cost: 1000, // 10 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'potters_tools',
    name: 'Potter\'s Tools',
    type: 'tool',
    weight: 3,
    cost: 1000, // 10 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'smiths_tools',
    name: 'Smith\'s Tools',
    type: 'tool',
    weight: 8,
    cost: 2000, // 20 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'tinkers_tools',
    name: 'Tinker\'s Tools',
    type: 'tool',
    weight: 10,
    cost: 5000, // 50 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'weavers_tools',
    name: 'Weaver\'s Tools',
    type: 'tool',
    weight: 5,
    cost: 100, // 1 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },
  {
    id: 'woodcarvers_tools',
    name: 'Woodcarver\'s Tools',
    type: 'tool',
    weight: 5,
    cost: 100, // 1 gp
    description: 'These special tools include the items needed to pursue a craft or trade.'
  },

  // Musical Instruments
  {
    id: 'bagpipes',
    name: 'Bagpipes',
    type: 'tool',
    weight: 6,
    cost: 3000, // 30 gp
    description: 'A musical instrument.'
  },
  {
    id: 'drum',
    name: 'Drum',
    type: 'tool',
    weight: 6,
    cost: 600, // 6 gp
    description: 'A musical instrument.'
  },
  {
    id: 'dulcimer',
    name: 'Dulcimer',
    type: 'tool',
    weight: 10,
    cost: 2500, // 25 gp
    description: 'A musical instrument.'
  },
  {
    id: 'flute',
    name: 'Flute',
    type: 'tool',
    weight: 1,
    cost: 200, // 2 gp
    description: 'A musical instrument.'
  },
  {
    id: 'lute',
    name: 'Lute',
    type: 'tool',
    weight: 2,
    cost: 3500, // 35 gp
    description: 'A musical instrument.'
  },
  {
    id: 'lyre',
    name: 'Lyre',
    type: 'tool',
    weight: 2,
    cost: 3000, // 30 gp
    description: 'A musical instrument.'
  },
  {
    id: 'horn',
    name: 'Horn',
    type: 'tool',
    weight: 2,
    cost: 300, // 3 gp
    description: 'A musical instrument.'
  },
  {
    id: 'pan_flute',
    name: 'Pan Flute',
    type: 'tool',
    weight: 2,
    cost: 1200, // 12 gp
    description: 'A musical instrument.'
  },
  {
    id: 'shawm',
    name: 'Shawm',
    type: 'tool',
    weight: 1,
    cost: 200, // 2 gp
    description: 'A musical instrument.'
  },
  {
    id: 'viol',
    name: 'Viol',
    type: 'tool',
    weight: 1,
    cost: 3000, // 30 gp
    description: 'A musical instrument.'
  },

  // Gaming Sets
  {
    id: 'dice_set',
    name: 'Dice Set',
    type: 'tool',
    weight: 0,
    cost: 10, // 1 sp
    description: 'A set of dice for games of chance.'
  },
  {
    id: 'dragonchess_set',
    name: 'Dragonchess Set',
    type: 'tool',
    weight: 0.5,
    cost: 100, // 1 gp
    description: 'A board game for two players.'
  },
  {
    id: 'playing_cards',
    name: 'Playing Cards',
    type: 'tool',
    weight: 0,
    cost: 50, // 5 sp
    description: 'A deck of cards for games of chance.'
  },
  {
    id: 'three_dragon_ante',
    name: 'Three-Dragon Ante Set',
    type: 'tool',
    weight: 0,
    cost: 100, // 1 gp
    description: 'A card game for two or more players.'
  }
];
