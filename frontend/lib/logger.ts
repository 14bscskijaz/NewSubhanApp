import pino from 'pino';

// Check if code is running on browser or server
const isClient = typeof window !== 'undefined';

interface LogData {
  level: string;
  message: string;
  time: string;
  [key: string]: any;
}

// Server-side logger uses the global instance set up in instrumentation.ts
const getServerLogger = () => {
  return globalThis?.logger || 
    pino({ level: 'info' }); // Fallback logger if global isn't set
}

// Client-side logger that sends logs to backend API
const createClientLogger = () => {
  // Configure batching settings
  const BATCH_SIZE_LIMIT = 20; // Maximum number of logs in a batch
  const BATCH_TIME_LIMIT = 5000; // Maximum time (ms) before sending a batch
  const IMMEDIATE_LEVELS = ['error', 'fatal']; // These levels are sent immediately

  // Log queue and timer
  let logQueue: LogData[] = [];
  let batchTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // Function to send logs to the backend
  const sendLogs = async (logs: LogData[]) => {
    if (logs.length === 0) return;
    
    try {
      await fetch('/api/logs/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs }),
      });
    } catch (error) {
      // Fallback to console if API call fails
      console.error('Failed to send logs to server:', error);
      
      // Log individual entries to console as fallback
      logs.forEach(log => {
        console[log.level as 'log' | 'info' | 'warn' | 'error']?.(
          `[${log.level.toUpperCase()}] ${log.message}`, log
        );
      });
    }
  };

  // Schedule batch sending
  const scheduleBatch = () => {
    if (batchTimeoutId === null) {
      batchTimeoutId = setTimeout(() => {
        const currentBatch = [...logQueue];
        logQueue = [];
        batchTimeoutId = null;
        sendLogs(currentBatch);
      }, BATCH_TIME_LIMIT);
    }
  };

  // Add log to the queue or send immediately for certain levels
  const queueLog = (level: string, message: string, args: Record<string, any> = {}): void => {
    const logEntry: LogData = {
      level,
      message,
      time: new Date().toISOString(),
      ...args,
      browser: true,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // For error and fatal logs, send immediately
    if (IMMEDIATE_LEVELS.includes(level)) {
      sendLogs([logEntry]);
      return;
    }

    // Add to queue
    logQueue.push(logEntry);

    // If we've reached the batch size limit, send immediately
    if (logQueue.length >= BATCH_SIZE_LIMIT) {
      const currentBatch = [...logQueue];
      logQueue = [];
      
      // Clear any existing timeout
      if (batchTimeoutId !== null) {
        clearTimeout(batchTimeoutId);
        batchTimeoutId = null;
      }
      
      // Send the batch
      sendLogs(currentBatch);
    } else {
      // Otherwise schedule a batch send
      scheduleBatch();
    }
  };

  // Send any remaining logs before the page unloads
  if (isClient) {
    window.addEventListener('beforeunload', () => {
      if (logQueue.length > 0) {
        // Use sendBeacon for more reliable delivery during page unload
        const blob = new Blob(
          [JSON.stringify({ logs: logQueue })], 
          { type: 'application/json' }
        );
        navigator.sendBeacon('/api/logs/batch', blob);
        logQueue = [];
      }
      
      if (batchTimeoutId !== null) {
        clearTimeout(batchTimeoutId);
        batchTimeoutId = null;
      }
    });
  }

  // Browser compatible logger interface
  return {
    debug: (msg: string, args = {}) => queueLog('debug', msg, args),
    info: (msg: string, args = {}) => queueLog('info', msg, args),
    warn: (msg: string, args = {}) => queueLog('warn', msg, args),
    error: (msg: string, args = {}) => queueLog('error', msg, args),
    fatal: (msg: string, args = {}) => queueLog('fatal', msg, args),
    // Manual flush method to send logs immediately
    flush: async () => {
      const currentBatch = [...logQueue];
      logQueue = [];
      
      if (batchTimeoutId !== null) {
        clearTimeout(batchTimeoutId);
        batchTimeoutId = null;
      }
      
      await sendLogs(currentBatch);
    },
    child: (bindings: Record<string, any>) => {
      // Support for child loggers with context
      return {
        debug: (msg: string, args = {}) => queueLog('debug', msg, { ...bindings, ...args }),
        info: (msg: string, args = {}) => queueLog('info', msg, { ...bindings, ...args }),
        warn: (msg: string, args = {}) => queueLog('warn', msg, { ...bindings, ...args }),
        error: (msg: string, args = {}) => queueLog('error', msg, { ...bindings, ...args }),
        fatal: (msg: string, args = {}) => queueLog('fatal', msg, { ...bindings, ...args }),
        flush: async () => {
          const currentBatch = [...logQueue];
          logQueue = [];
          
          if (batchTimeoutId !== null) {
            clearTimeout(batchTimeoutId);
            batchTimeoutId = null;
          }
          
          await sendLogs(currentBatch);
        },
      };
    },
  };
};

// Create a singleton instance of the client logger
const clientLoggerInstance = isClient ? createClientLogger() : null;

// Export the appropriate logger based on environment
export const logger = isClient ? clientLoggerInstance! : getServerLogger();

// Helper to create contextual loggers
export function getLogger(context: string) {
  return isClient 
    ? clientLoggerInstance!.child({ context }) 
    : getServerLogger().child({ context });
}