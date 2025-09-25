import { useState, useContext } from "react";
import { useLocation } from "wouter";
import { AuthContext } from "@/App";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin, AlertTriangle, User, FileText } from "lucide-react";
import ProfileModal from "@/components/ProfileModal";
import LoginModal from "@/components/LoginModal";
import ReportModal from "@/components/ReportModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function Landing() {
  const [, navigate] = useLocation();
  const { user } = useContext(AuthContext);
  const [isChoiceModalOpen, setChoiceModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  const features = [
    {
      id: "navigate",
      title: "Navigate",
      description: "Find safer routes avoiding high-risk areas",
      icon: <Navigation className="h-12 w-12" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      path: "/navigate",
    },
    {
      id: "report",
      title: "Report Incident",
      description: "Submit reports about incidents with optional photos/videos",
      icon: <FileText className="h-12 w-12" />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      action: () => setReportModalOpen(true),
    },
    {
      id: "current-location",
      title: "Current Location",
      description: "View your location and nearby risk zones",
      icon: <MapPin className="h-12 w-12" />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      path: "/current-location",
    },
    {
      id: "sos",
      title: "SOS",
      description: "Emergency alert with instant family notification",
      icon: <AlertTriangle className="h-12 w-12" />,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      path: "/sos",
    },
  ];

  const handleFeatureClick = (feature: any) => {
    if (feature.path) {
      console.log(`Navigating to ${feature.path}`); // TODO: remove mock functionality
      navigate(feature.path);
    } else if (feature.action) {
      feature.action();
    }
  };

  const handleProfileButtonClick = () => {
    setChoiceModalOpen(true);
  };

  const handleLoginClick = () => {
    setChoiceModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleSignupClick = () => {
    setChoiceModalOpen(false);
    setProfileModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            SafeOrbit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal safety companion. Navigate safely, stay informed, and get help when you need it most.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className={`aspect-square hover-elevate cursor-pointer transition-all duration-200 ${feature.borderColor} border-2`}
              onClick={() => handleFeatureClick(feature)}
              data-testid={`card-${feature.id}`}
            >
              <CardContent className={`h-full flex flex-col items-center justify-center p-8 ${feature.bgColor}`}>
                <div className={`mb-6 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Stay safe, stay informed. Your security is our priority.
          </p>
        </div>
      </div>

      {/* Profile Button in corner */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleProfileButtonClick}
          variant="outline"
          size="sm"
          className="gap-2"
          data-testid="button-profile"
        >
          <User className="h-5 w-5" />
          {user ? user.name : "Profile"}
        </Button>
      </div>

      {/* Choice Dialog for Login/Signup */}
      <Dialog open={isChoiceModalOpen} onOpenChange={() => setChoiceModalOpen(false)}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Login or Signup</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-between gap-4">
            <Button onClick={handleLoginClick} variant="outline" className="flex-1">
              Login
            </Button>
            <Button onClick={handleSignupClick} variant="default" className="flex-1">
              Signup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} onSwitchToProfileCreate={handleSignupClick} />

      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />

      {/* Report Modal */}
      <ReportModal isOpen={isReportModalOpen} onClose={() => setReportModalOpen(false)} />
    </div>
  );
}
