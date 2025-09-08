import { Party, PartyMember, PartyWithMembers } from '../types/party.js';
import { GameEntity, CharacterEntity, isCharacter } from '../types/entity.js';
import { loadEntityCollection, saveEntityCollection, loadEntity } from './storage.js';
import { v4 as uuidv4 } from 'uuid';

export async function createParty(name: string, description?: string): Promise<Party> {
  const party: Party = {
    id: uuidv4(),
    name,
    description,
    memberIds: [],
    created: new Date(),
    modified: new Date()
  };

  const collection = await loadEntityCollection();
  collection.parties.push(party);
  await saveEntityCollection(collection);

  return party;
}

export async function getParty(id: string): Promise<Party | null> {
  const collection = await loadEntityCollection();
  return collection.parties.find(p => p.id === id) || null;
}

export async function getPartyWithMembers(id: string): Promise<PartyWithMembers | null> {
  const party = await getParty(id);
  if (!party) return null;

  const members: PartyMember[] = [];
  let totalLevel = 0;
  let characterCount = 0;

  for (const memberId of party.memberIds) {
    const entity = await loadEntity(memberId);
    if (entity) {
      members.push({
        entity,
        joinDate: new Date() // TODO: Track actual join dates
      });

      // Only count characters for level calculations
      if (isCharacter(entity)) {
        totalLevel += entity.level;
        characterCount++;
      }
    }
  }

  const averageLevel = characterCount > 0 ? Math.round(totalLevel / characterCount) : 1;

  return {
    id: party.id,
    name: party.name,
    description: party.description,
    members,
    averageLevel,
    totalLevel,
    created: party.created,
    modified: party.modified
  };
}

export async function addMemberToParty(partyId: string, entityId: string): Promise<void> {
  const collection = await loadEntityCollection();
  const party = collection.parties.find(p => p.id === partyId);
  
  if (!party) {
    throw new Error(`Party with ID ${partyId} not found`);
  }

  // Check if entity exists
  const entity = await loadEntity(entityId);
  if (!entity) {
    throw new Error(`Entity with ID ${entityId} not found`);
  }

  // Check if already a member
  if (party.memberIds.includes(entityId)) {
    throw new Error(`Entity ${entity.name} is already a member of party ${party.name}`);
  }

  party.memberIds.push(entityId);
  party.modified = new Date();
  await saveEntityCollection(collection);
}

export async function removeMemberFromParty(partyId: string, entityId: string): Promise<void> {
  const collection = await loadEntityCollection();
  const party = collection.parties.find(p => p.id === partyId);
  
  if (!party) {
    throw new Error(`Party with ID ${partyId} not found`);
  }

  const memberIndex = party.memberIds.indexOf(entityId);
  if (memberIndex === -1) {
    throw new Error(`Entity with ID ${entityId} is not a member of party ${party.name}`);
  }

  party.memberIds.splice(memberIndex, 1);
  party.modified = new Date();
  await saveEntityCollection(collection);
}

export async function updateParty(id: string, updates: Partial<Pick<Party, 'name' | 'description'>>): Promise<Party> {
  const collection = await loadEntityCollection();
  const party = collection.parties.find(p => p.id === id);
  
  if (!party) {
    throw new Error(`Party with ID ${id} not found`);
  }

  if (updates.name !== undefined) {
    party.name = updates.name;
  }
  if (updates.description !== undefined) {
    party.description = updates.description;
  }
  
  party.modified = new Date();
  await saveEntityCollection(collection);
  
  return party;
}

export async function deleteParty(id: string): Promise<void> {
  const collection = await loadEntityCollection();
  const partyIndex = collection.parties.findIndex(p => p.id === id);
  
  if (partyIndex === -1) {
    throw new Error(`Party with ID ${id} not found`);
  }

  collection.parties.splice(partyIndex, 1);
  
  // Clear active party if it was the deleted one
  if (collection.activePartyId === id) {
    collection.activePartyId = undefined;
  }
  
  await saveEntityCollection(collection);
}

export async function listParties(): Promise<Party[]> {
  const collection = await loadEntityCollection();
  return collection.parties;
}

export async function setActiveParty(id: string): Promise<void> {
  const party = await getParty(id);
  if (!party) {
    throw new Error(`Party with ID ${id} not found`);
  }

  const collection = await loadEntityCollection();
  collection.activePartyId = id;
  await saveEntityCollection(collection);
}

export async function getActiveParty(): Promise<Party | null> {
  const collection = await loadEntityCollection();
  if (!collection.activePartyId) {
    return null;
  }
  return await getParty(collection.activePartyId);
}

export async function getActivePartyWithMembers(): Promise<PartyWithMembers | null> {
  const collection = await loadEntityCollection();
  if (!collection.activePartyId) {
    return null;
  }
  return await getPartyWithMembers(collection.activePartyId);
}

export async function clearActiveParty(): Promise<void> {
  const collection = await loadEntityCollection();
  collection.activePartyId = undefined;
  await saveEntityCollection(collection);
}

export function calculatePartyLevel(members: PartyMember[]): { averageLevel: number; totalLevel: number } {
  const characters = members.filter(m => isCharacter(m.entity)) as Array<PartyMember & { entity: CharacterEntity }>;
  
  if (characters.length === 0) {
    return { averageLevel: 1, totalLevel: 0 };
  }

  const totalLevel = characters.reduce((sum, member) => sum + member.entity.level, 0);
  const averageLevel = Math.round(totalLevel / characters.length);

  return { averageLevel, totalLevel };
}