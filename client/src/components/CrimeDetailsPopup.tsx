import { CrimeIncident } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, AlertCircle } from 'lucide-react';

interface CrimeDetailsPopupProps {
  crime: CrimeIncident | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CrimeDetailsPopup({ crime, isOpen, onClose }: CrimeDetailsPopupProps) {
  if (!crime) return null;

  const getSeverityColor = (severity: number) => {
    if (severity >= 7) return 'bg-safety-unsafe text-white';
    if (severity >= 4) return 'bg-safety-moderate text-white';
    return 'bg-safety-safe text-white';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 7) return 'High';
    if (severity >= 4) return 'Medium';
    return 'Low';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="dialog-crime-details">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-destructive" />
            {crime.type} Incident
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          {/* Severity Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Severity:</span>
            <Badge 
              className={getSeverityColor(crime.severity)}
              data-testid={`badge-severity-${getSeverityLabel(crime.severity).toLowerCase()}`}
            >
              {getSeverityLabel(crime.severity)} ({crime.severity}/10)
            </Badge>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Date:</span>
            <span className="text-sm font-medium" data-testid="text-crime-date">
              {new Date(crime.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Location:</span>
            <span className="text-sm font-medium" data-testid="text-crime-location">
              {parseFloat(crime.lat).toFixed(4)}°, {parseFloat(crime.lng).toFixed(4)}°
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Description:</span>
            <p className="text-sm leading-relaxed p-3 bg-muted rounded-md" data-testid="text-crime-description">
              {crime.description}
            </p>
          </div>

          {/* Crime ID for reference */}
          <div className="pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Incident ID: {crime.id}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}