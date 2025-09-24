import { SafetyScore } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react';

interface SafetyScoreCardProps {
  safetyScore: SafetyScore;
  crimeCount: number;
}

export default function SafetyScoreCard({ safetyScore, crimeCount }: SafetyScoreCardProps) {
  const getIcon = () => {
    switch (safetyScore.color) {
      case 'safe':
        return <Shield className="h-5 w-5 text-safety-safe" />;
      case 'moderate':
        return <AlertTriangle className="h-5 w-5 text-safety-moderate" />;
      case 'unsafe':
        return <AlertCircle className="h-5 w-5 text-safety-unsafe" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getScoreColor = () => {
    switch (safetyScore.color) {
      case 'safe':
        return 'text-safety-safe';
      case 'moderate':
        return 'text-safety-moderate';
      case 'unsafe':
        return 'text-safety-unsafe';
      default:
        return 'text-foreground';
    }
  };

  const getBadgeVariant = () => {
    switch (safetyScore.color) {
      case 'safe':
        return 'default';
      case 'moderate':
        return 'secondary';
      case 'unsafe':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card className="w-full max-w-xs" data-testid="card-safety-score">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {getIcon()}
          Safety Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor()}`} data-testid="text-safety-score">
            {safetyScore.score}
          </div>
          <div className="text-sm text-muted-foreground">out of 100</div>
        </div>
        
        <div className="text-center">
          <Badge 
            variant={getBadgeVariant()} 
            className="text-sm font-medium"
            data-testid={`badge-safety-level-${safetyScore.color}`}
          >
            {safetyScore.level}
          </Badge>
        </div>

        <div className="text-center pt-1">
          <div className="text-sm text-muted-foreground">
            Based on{' '}
            <span className="font-medium" data-testid="text-crime-count">
              {crimeCount}
            </span>{' '}
            {crimeCount === 1 ? 'incident' : 'incidents'} in view
          </div>
        </div>
      </CardContent>
    </Card>
  );
}