import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceSearchProps {
  isActive: boolean;
  onClose: () => void;
  onSearchResult: (query: string) => void;
}

export const VoiceSearch = ({ isActive, onClose, onSearchResult }: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setIsListening(false);
      setTranscript('');
      setConfidence(0);
      return;
    }

    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          setConfidence(result[0].confidence);
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        onSearchResult(finalTranscript);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isActive) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isActive, onClose, onSearchResult]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      // Restart recognition
      window.location.reload();
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant animate-scale-in">
        <CardContent className="p-6 text-center space-y-6">
          {/* Microphone Animation */}
          <div className="relative">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center ${
              isListening ? 'animate-pulse' : ''
            }`}>
              {isListening ? (
                <Mic className="w-8 h-8 text-white" />
              ) : (
                <MicOff className="w-8 h-8 text-white" />
              )}
            </div>
            
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {isListening ? 'Listening...' : 'Voice Search'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {isListening 
                ? 'Speak now to search for products'
                : 'Click the microphone to start'
              }
            </p>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="space-y-2">
              <Badge variant="secondary" className="px-3 py-1">
                <Volume2 className="w-3 h-3 mr-1" />
                You said:
              </Badge>
              <p className="text-lg font-medium text-primary">"{transcript}"</p>
              {confidence > 0 && (
                <p className="text-xs text-muted-foreground">
                  Confidence: {Math.round(confidence * 100)}%
                </p>
              )}
            </div>
          )}

          {/* Example Commands */}
          {!transcript && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Try saying:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>"Find cotton T-shirts under 1000 rupees"</p>
                <p>"Show me red sneakers size 8"</p>
                <p>"What's the best deal today?"</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex space-x-3">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              className="flex-1"
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};