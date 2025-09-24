import { CrimeIncident, SafetyScore } from '@shared/schema';

// Calculate safety score based on crimes in view
export function calculateSafetyScore(crimes: CrimeIncident[]): SafetyScore {
  if (crimes.length === 0) {
    return {
      score: 100,
      level: 'Very Safe',
      color: 'safe'
    };
  }

  // Sum all severities and calculate weighted score
  const totalSeverity = crimes.reduce((sum, crime) => sum + crime.severity, 0);
  const averageSeverity = totalSeverity / crimes.length;
  
  // Adjust for crime density - more crimes = lower safety
  const densityPenalty = Math.min(crimes.length * 2, 30); // Cap at 30 points
  
  // Base score calculation: 100 - (average severity * 8) - density penalty
  const rawScore = 100 - (averageSeverity * 8) - densityPenalty;
  const score = Math.max(0, Math.min(100, rawScore));

  // Determine safety level and color based on score
  let level: SafetyScore['level'];
  let color: SafetyScore['color'];

  if (score >= 80) {
    level = 'Very Safe';
    color = 'safe';
  } else if (score >= 65) {
    level = 'Safe';
    color = 'safe';
  } else if (score >= 45) {
    level = 'Moderate';
    color = 'moderate';
  } else if (score >= 25) {
    level = 'Use Caution';
    color = 'unsafe';
  } else {
    level = 'High Risk';
    color = 'unsafe';
  }

  return { score: Math.round(score), level, color };
}

// Filter crimes by date range
export function filterCrimesByDateRange(crimes: CrimeIncident[], dateRange: string): CrimeIncident[] {
  const now = new Date();
  let cutoffDate: Date;

  switch (dateRange) {
    case 'Last 30 days':
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'Last 6 months':
      cutoffDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      break;
    case 'All Time':
    default:
      return crimes;
  }

  return crimes.filter(crime => new Date(crime.date) >= cutoffDate);
}

// Check if a coordinate is within map bounds
export function isWithinBounds(
  lat: number,
  lng: number,
  bounds: { north: number; south: number; east: number; west: number }
): boolean {
  return lat <= bounds.north && lat >= bounds.south && 
         lng <= bounds.east && lng >= bounds.west;
}

// Get crimes within map bounds
export function getCrimesInBounds(
  crimes: CrimeIncident[],
  bounds: { north: number; south: number; east: number; west: number }
): CrimeIncident[] {
  return crimes.filter(crime => 
    isWithinBounds(parseFloat(crime.lat), parseFloat(crime.lng), bounds)
  );
}