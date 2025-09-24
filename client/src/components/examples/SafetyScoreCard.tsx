import SafetyScoreCard from '../SafetyScoreCard';
import { SafetyScore } from '@shared/schema';

export default function SafetyScoreCardExample() {
  const safetyScore: SafetyScore = {
    score: 72,
    level: 'Safe',
    color: 'safe'
  };

  return (
    <div className="p-4 bg-background">
      <SafetyScoreCard 
        safetyScore={safetyScore}
        crimeCount={12}
      />
    </div>
  );
}