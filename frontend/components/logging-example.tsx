'use client';

import { useState } from 'react';
import { logger, getLogger } from '@/lib/logger';
import { Button } from '@/components/ui/button';

export function LoggingExample() {
  const [message, setMessage] = useState('');
  
  // Create a contextual logger for this component
  const componentLogger = getLogger('LoggingExample');
  
  const handleLogInfo = () => {
    componentLogger.info('Button clicked for info log', { 
      action: 'button_click',
      component: 'LoggingExample' 
    });
    setMessage('Info log sent to server! Check Grafana to see it.');
  };
  
  const handleLogWarning = () => {
    componentLogger.warn('This is a warning log example', { 
      action: 'warning_example',
      component: 'LoggingExample' 
    });
    setMessage('Warning log sent to server! Check Grafana to see it.');
  };
  
  const handleLogError = () => {
    componentLogger.error('This is an error log example', { 
      action: 'error_example',
      component: 'LoggingExample',
      stack: new Error().stack
    });
    setMessage('Error log sent to server! Check Grafana to see it.');
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h2 className="text-xl font-bold">Client-side Logging Example</h2>
      <div className="flex flex-col space-y-2">
        <Button onClick={handleLogInfo} variant="default">Send Info Log</Button>
        <Button onClick={handleLogWarning} variant="destructive">Send Warning Log</Button>
        <Button onClick={handleLogError} variant="destructive">Send Error Log</Button>
      </div>
      {message && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}
    </div>
  );
}