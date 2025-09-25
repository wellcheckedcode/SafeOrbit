import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { crimeTypes } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Upload } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: "",
    lat: "",
    lng: "",
    severity: "",
    date: new Date().toISOString().split('T')[0], // Today's date
    description: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        }));
        setIsGettingLocation(false);
        toast({
          title: "Location obtained",
          description: "Current location has been set.",
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location error",
          description: "Unable to get your current location. Please enter manually.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      }
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.type || !formData.lat || !formData.lng || !formData.severity || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reportPayload = {
        lat: formData.lat,
        lng: formData.lng,
        type: formData.type,
        severity: parseInt(formData.severity),
        date: formData.date,
        description: formData.description,
      };

      // Send to backend API
      const response = await apiRequest('POST', '/api/crimes', reportPayload);
      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      toast({
        title: "Report submitted",
        description: "Your incident report has been submitted successfully.",
      });

      // Invalidate crimes query to refresh the map
      queryClient.invalidateQueries({ queryKey: ['crimes'] });

      // Reset form
      setFormData({
        type: "",
        lat: "",
        lng: "",
        severity: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
      });
      setPhotos([]);
      setVideos([]);

      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      type: "",
      lat: "",
      lng: "",
      severity: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
    });
    setPhotos([]);
    setVideos([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report an Incident</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Incident Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                {crimeTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location *</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Latitude"
                value={formData.lat}
                onChange={(e) => handleInputChange("lat", e.target.value)}
              />
              <Input
                placeholder="Longitude"
                value={formData.lng}
                onChange={(e) => handleInputChange("lng", e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
              >
                <MapPin className="h-4 w-4" />
                {isGettingLocation ? "Getting..." : "Current"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity (1-10) *</Label>
            <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the incident..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos">Photos (optional)</Label>
            <Input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photos.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {photos.length} photo(s) selected
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="videos">Videos (optional)</Label>
            <Input
              id="videos"
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoChange}
            />
            {videos.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {videos.length} video(s) selected
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
