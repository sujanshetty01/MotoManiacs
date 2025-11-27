/**
 * Script to seed initial events into Firestore
 * Run this once to populate your Firestore with initial event data
 * 
 * Usage: Import and call seedEvents() from your app or run in browser console
 */

import { addEvent } from '../services/eventsService';
import { mockEvents } from '../data/mockData';

export const seedEvents = async () => {
  try {
    console.log('Starting to seed events...');
    let count = 0;
    
    for (const event of mockEvents) {
      try {
        // Extract id from event and add the rest
        const { id, ...eventData } = event;
        await addEvent(eventData);
        count++;
        console.log(`✓ Added event: ${event.title}`);
      } catch (error) {
        console.error(`✗ Failed to add event: ${event.title}`, error);
      }
    }
    
    console.log(`\n✅ Successfully seeded ${count} events!`);
  } catch (error) {
    console.error('Error seeding events:', error);
    throw error;
  }
};

// If running directly (not recommended, but possible)
if (typeof window !== 'undefined') {
  (window as any).seedEvents = seedEvents;
  console.log('seedEvents() is now available in the console. Call it to seed events.');
}

