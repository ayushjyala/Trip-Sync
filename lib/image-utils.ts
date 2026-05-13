import { City } from './india-destinations';

export function getFallbackImageForDestination(destination: any): string {
  if (!destination) return 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80';
  
  const text = (
    (destination.description || '') + ' ' + 
    (destination.attractions ? destination.attractions.join(' ') : '') + ' ' + 
    (destination.experiences ? destination.experiences.join(' ') : '')
  ).toLowerCase();
  
  if (text.includes('beach') || text.includes('coast') || text.includes('island')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'; // Beach
  }
  if (text.includes('mountain') || text.includes('hill') || text.includes('peak') || text.includes('valley') || text.includes('snow')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'; // Mountains
  }
  if (text.includes('forest') || text.includes('wildlife') || text.includes('national park') || text.includes('jungle')) {
    return 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'; // Forest
  }
  if (text.includes('river') || text.includes('lake') || text.includes('waterfall') || text.includes('backwater')) {
    return 'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&w=800&q=80'; // River/Lake
  }
  if (text.includes('temple') || text.includes('palace') || text.includes('fort') || text.includes('heritage') || text.includes('history')) {
    return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'; // Heritage/Temple
  }
  
  return 'https://images.unsplash.com/photo-1514222134-b57eaf8ce22a?auto=format&fit=crop&w=800&q=80'; // Urban/City default
}
