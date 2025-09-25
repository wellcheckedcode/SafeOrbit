import { useState, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertTriangle, Camera, Mic, MapPin, Send } from 'lucide-react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import type { InsertSosEvent } from '@shared/schema';

interface SOSState {
  step: 'confirm' | 'capturing' | 'processing' | 'completed' | 'error';
  location: { lat: number; lng: number } | null;
  photoData: string | null;
  audioData: Blob | null;
  errorMessage: string | null;
}

export default function SOS() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [sosState, setSosState] = useState<SOSState>({
    step: 'confirm',
    location: null,
    photoData: null,
    audioData: null,
    errorMessage: null
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleBack = () => {
    // Stop any ongoing media capture
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    navigate('/');
  };

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const capturePhoto = async (): Promise<string> => {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    return new Promise((resolve, reject) => {
      if (!videoRef.current || !canvasRef.current) {
        reject(new Error('Video elements not available'));
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          // Stop the stream
          stream.getTracks().forEach(track => track.stop());
          
          resolve(dataUrl);
        } else {
          reject(new Error('Could not get canvas context'));
        }
      }, { once: true });
    });
  };

  const captureAudio = async (): Promise<Blob> => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    return new Promise((resolve, reject) => {
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        resolve(new Blob(chunks, { type: 'audio/webm' }));
      };
      mediaRecorder.onerror = reject;
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      // Record for 5 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 5000);
    });
  };

  // SOS submission mutation
  const sosMutation = useMutation({
    mutationFn: async ({ location, photoData, audioData }: {
      location: { lat: number; lng: number };
      photoData: string;
      audioData: Blob;
    }) => {
      // Convert audio blob to base64
      const audioBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data: prefix
        };
        reader.readAsDataURL(audioData);
      });

      const sosEventData: InsertSosEvent = {
        userId: 'temp-user', // TODO: Get from auth context
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        photoPath: photoData.split(',')[1], // Remove data: prefix
        audioPath: audioBase64,
        status: 'active',
      };

      const response = await apiRequest('POST', '/api/sos/trigger', sosEventData);
      

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Emergency Alert Sent',
        description: 'Your emergency contacts have been notified and authorities alerted.',
      });
      setSosState(prev => ({ ...prev, step: 'completed' }));
    },
    onError: (error) => {
      console.error('SOS error:', error);
      toast({
        title: 'SOS Error',
        description: 'Failed to process emergency request. Please call emergency services directly.',
        variant: 'destructive',
      });
      setSosState(prev => ({ 
        ...prev, 
        step: 'error', 
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    },
  });

  const triggerSOS = useCallback(async () => {
    try {
      setSosState(prev => ({ ...prev, step: 'capturing' }));

      // Get user location
      const location = await getLocation();
      setSosState(prev => ({ ...prev, location }));

      // Capture photo and audio simultaneously
      const [photoData, audioData] = await Promise.all([
        capturePhoto(),
        captureAudio()
      ]);

      setSosState(prev => ({ 
        ...prev, 
        photoData, 
        audioData, 
        step: 'processing' 
      }));

      // Submit to backend for processing
      sosMutation.mutate({ location, photoData, audioData });

    } catch (error) {
      console.error('SOS error:', error);
      setSosState(prev => ({ 
        ...prev, 
        step: 'error', 
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  }, [sosMutation]);

  const renderContent = () => {
    switch (sosState.step) {
      case 'confirm':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">Emergency SOS</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                This will immediately capture your location, photo, and audio, then analyze the situation 
                and alert your emergency contacts.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span>Access your location</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Camera className="h-4 w-4 text-red-500" />
                  <span>Take emergency photo</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mic className="h-4 w-4 text-red-500" />
                  <span>Record 5-second audio</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Send className="h-4 w-4 text-red-500" />
                  <span>Alert family members</span>
                </div>
              </div>

              <Button
                onClick={triggerSOS}
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                data-testid="button-trigger-sos"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                ACTIVATE SOS
              </Button>
            </CardContent>
          </Card>
        );

      case 'capturing':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-yellow-600 animate-pulse" />
              </div>
              <CardTitle className="text-xl">Capturing Emergency Data</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Badge variant="secondary" className="animate-pulse">
                Please stay still - capturing photo and audio
              </Badge>
              <div className="space-y-2 text-sm text-muted-foreground">
                {sosState.location && <div>✓ Location acquired</div>}
                <div>📸 Taking emergency photo...</div>
                <div>🎤 Recording audio (5 seconds)...</div>
              </div>
            </CardContent>
          </Card>
        );

      case 'processing':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <CardTitle className="text-xl">Processing Emergency</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Badge variant="secondary" className="animate-pulse">
                Analyzing situation and alerting contacts
              </Badge>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>✓ Data captured successfully</div>
                <div>🤖 AI analyzing emergency situation...</div>
                <div>📱 Sending alerts to family members...</div>
              </div>
            </CardContent>
          </Card>
        );

      case 'completed':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-600">Emergency Alerts Sent</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2 text-sm">
                <div>✓ Location shared with contacts</div>
                <div>✓ Emergency photo analyzed</div>
                <div>✓ Family members notified</div>
              </div>
              
              {sosState.location && (
                <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
                  <strong>Emergency Location:</strong><br />
                  {sosState.location.lat.toFixed(6)}, {sosState.location.lng.toFixed(6)}
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  className="w-full"
                  data-testid="button-back-home"
                >
                  Return Home
                </Button>
                <p className="text-xs text-muted-foreground">
                  Help should be on the way. Stay in a safe location if possible.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'error':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">SOS Error</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                {sosState.errorMessage || 'An error occurred while processing your emergency request.'}
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => setSosState(prev => ({ ...prev, step: 'confirm', errorMessage: null }))}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  data-testid="button-retry-sos"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  className="w-full"
                  data-testid="button-back-home-error"
                >
                  Return Home
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                If this is a real emergency, please call local emergency services directly.
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-semibold">Emergency SOS</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>

      {/* Hidden elements for media capture */}
      <div className="hidden">
        <video ref={videoRef} muted />
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}