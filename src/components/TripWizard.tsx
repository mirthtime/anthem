
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Plus, X, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputField } from '@/components/ui/input-field';
import { TextareaField } from '@/components/ui/textarea-field';
import { Badge } from '@/components/ui/badge';
import { TripStop } from '@/types';
import { useTrips } from '@/hooks/useTrips';
import { useAutoSave } from '@/hooks/useAutoSave';
import { AutoSaveIndicator } from '@/components/AutoSaveIndicator';
import { toast } from '@/hooks/use-toast';

interface TripWizardProps {
  onComplete?: () => void;
}

export const TripWizard = ({ onComplete }: TripWizardProps) => {
  const navigate = useNavigate();
  const { createTrip } = useTrips();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  // Form data
  const [tripData, setTripData] = useState({
    title: '',
    description: '',
  });

  const [stops, setStops] = useState<TripStop[]>([]);
  const [currentStop, setCurrentStop] = useState<TripStop>({
    name: '',
    description: '',
    stories: '',
    people: ''
  });

  // Auto-save setup
  const autoSaveData = {
    tripData,
    stops,
    currentStop,
    currentStep
  };

  const { isSaving, lastSaved, loadFromStorage, clearSaved } = useAutoSave({
    key: 'trip-wizard-draft',
    data: autoSaveData,
    debounceMs: 2000 // Save 2 seconds after user stops typing
  });

  // Load saved data on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved && saved.data) {
      const { tripData: savedTripData, stops: savedStops, currentStop: savedCurrentStop, currentStep: savedStep } = saved.data;
      
      // Only restore if there's meaningful data
      if (savedTripData?.title || savedStops?.length > 0) {
        setTripData(savedTripData || { title: '', description: '' });
        setStops(savedStops || []);
        setCurrentStop(savedCurrentStop || { name: '', description: '', stories: '', people: '' });
        setCurrentStep(savedStep || 1);
        
        toast({
          title: "Draft Restored",
          description: "We've restored your previous work from " + formatDistanceToNow(saved.timestamp) + " ago.",
        });
      }
    }
  }, [loadFromStorage]);

  const steps = [
    { number: 1, title: 'Trip Details', description: 'Basic information about your trip' },
    { number: 2, title: 'Add Stops', description: 'Places you\'ll visit on your journey' },
    { number: 3, title: 'Review', description: 'Review and create your trip' }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddStop = () => {
    if (!currentStop.name.trim()) return;

    setStops([...stops, { ...currentStop }]);
    setCurrentStop({
      name: '',
      description: '',
      stories: '',
      people: ''
    });
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleStartOver = () => {
    setTripData({ title: '', description: '' });
    setStops([]);
    setCurrentStop({ name: '', description: '', stories: '', people: '' });
    setCurrentStep(1);
    clearSaved();
    toast({
      title: "Draft Cleared",
      description: "Started over with a fresh trip.",
    });
  };

  const handleCreateTrip = async () => {
    if (!tripData.title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a trip title.",
        variant: "destructive",
      });
      return;
    }

    if (stops.length === 0) {
      toast({
        title: "Missing Information", 
        description: "Please add at least one stop to your trip.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const newTrip = await createTrip({
        title: tripData.title,
        description: tripData.description,
        stops: stops
      });

      // Clear the saved draft after successful creation
      clearSaved();

      toast({
        title: "Trip Created!",
        description: "Your trip has been successfully created.",
      });

      if (onComplete) {
        onComplete();
      } else {
        navigate(`/trip/${newTrip.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const canProceedFromStep1 = tripData.title.trim().length > 0;
  const canProceedFromStep2 = stops.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                currentStep >= step.number
                  ? 'bg-gradient-primary text-white border-primary'
                  : 'border-border text-muted-foreground'
              }`}>
                {step.number}
              </div>
              
              <div className="ml-3 hidden sm:block">
                <div className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Auto-save indicator and controls */}
      <div className="flex justify-between items-center mb-4 p-3 rounded-lg bg-accent/20 border border-border">
        <AutoSaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStartOver}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>

      {/* Step Content */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl">
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            {/* Step 1: Trip Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <InputField
                  label="Trip Title"
                  placeholder="e.g., California Coast Road Trip"
                  value={tripData.title}
                  onChange={(e) => setTripData({ ...tripData, title: e.target.value })}
                  required
                />
                
                <TextareaField
                  label="Description (Optional)"
                  placeholder="Tell us about your trip..."
                  value={tripData.description}
                  onChange={(e) => setTripData({ ...tripData, description: e.target.value })}
                  rows={4}
                />
              </motion.div>
            )}

            {/* Step 2: Add Stops */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Current Stops */}
                {stops.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-foreground">Your Stops:</h3>
                    <div className="space-y-2">
                      {stops.map((stop, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-accent/50 border border-border">
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-primary" />
                            <div>
                              <div className="font-medium text-foreground">{stop.name}</div>
                              {stop.description && (
                                <div className="text-sm text-muted-foreground">{stop.description}</div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveStop(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Stop */}
                <div className="space-y-4 p-4 rounded-xl border border-dashed border-border">
                  <h3 className="font-medium text-foreground">Add New Stop:</h3>
                  
                  <InputField
                    label="Stop Name"
                    placeholder="e.g., San Francisco, Golden Gate Bridge"
                    value={currentStop.name}
                    onChange={(e) => setCurrentStop({ ...currentStop, name: e.target.value })}
                  />
                  
                  <TextareaField
                    label="Description (Optional)"
                    placeholder="What makes this stop special?"
                    value={currentStop.description}
                    onChange={(e) => setCurrentStop({ ...currentStop, description: e.target.value })}
                    rows={2}
                  />
                  
                  <TextareaField
                    label="Stories & Memories (Optional)"
                    placeholder="Any special memories or stories from this place?"
                    value={currentStop.stories}
                    onChange={(e) => setCurrentStop({ ...currentStop, stories: e.target.value })}
                    rows={2}
                  />
                  
                  <InputField
                    label="People (Optional)"
                    placeholder="Who will you be with? e.g., friends, family"
                    value={currentStop.people}
                    onChange={(e) => setCurrentStop({ ...currentStop, people: e.target.value })}
                  />
                  
                  <Button
                    onClick={handleAddStop}
                    disabled={!currentStop.name.trim()}
                    className="w-full gap-2"
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4" />
                    Add Stop
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Trip Summary:</h3>
                  
                  <div className="p-4 rounded-xl bg-accent/30 border border-border">
                    <h4 className="font-semibold text-lg text-foreground">{tripData.title}</h4>
                    {tripData.description && (
                      <p className="text-muted-foreground mt-1">{tripData.description}</p>
                    )}
                    
                    <div className="mt-4">
                      <div className="text-sm font-medium text-foreground mb-2">
                        Stops ({stops.length}):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stops.map((stop, index) => (
                          <Badge key={index} variant="secondary">
                            {stop.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !canProceedFromStep1) ||
                  (currentStep === 2 && !canProceedFromStep2)
                }
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreateTrip}
                disabled={isCreating}
                className="gap-2"
              >
                {isCreating ? 'Creating Trip...' : 'Create Trip'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
