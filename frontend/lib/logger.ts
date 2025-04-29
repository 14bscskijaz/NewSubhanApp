import pino, { Logger } from 'pino';

// Check if code is running on browser or server
const isClient = typeof window !== 'undefined';

interface LogData {
  level: string;
  message: string;
  time: string;
  [key: string]: any;
}

// Server-side logger uses the global instance set up in instrumentation.ts
export const getServerLogger = (): Logger => {
  return globalThis?.logger || 
    pino({ level: 'info' }); // Fallback logger if global isn't set
}

// Helper function to serialize Error objects
const serializeError = (error: any): Record<string, any> => {
  if (!(error instanceof Error)) {
    return error;
  }

  // Extract all properties from the error object
  const serialized: Record<string, any> = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  // Copy any custom properties the error might have
  Object.getOwnPropertyNames(error).forEach(prop => {
    if (!['name', 'message', 'stack'].includes(prop)) {
      try {
        const value = (error as any)[prop];
        serialized[prop] = value instanceof Error ? serializeError(value) : value;
      } catch (e) {
        serialized[prop] = 'Could not serialize property';
      }
    }
  });

  return serialized;
};

// Function to recursively serialize any Error objects in a log entry
const serializeLogEntry = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (obj instanceof Error) {
    return serializeError(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeLogEntry);
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      try {
        result[key] = serializeLogEntry(obj[key]);
      } catch (e) {
        result[key] = 'Could not serialize value';
      }
    }
    return result;
  }
  
  return obj;
};

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

    // console.log(" Sending logs to server:", JSON.stringify({ logs }));

    try {
      // Create a serialized copy of the logs with all errors properly serialized
      // const serializedLogs = logs.map(log => serializeLogEntry(log));
      
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
  const queueLog = (level: string, message: string, args: Record<string, any> = {}, err: Record<string, any> = {}): void => {

    // console.log("THe args object in queueLog", serializeLogEntry(args));

    const logEntry: LogData = {
      level,
      message,
      time: new Date().toISOString(),
      ...serializeLogEntry(args),
      error: serializeLogEntry(err),
      browser: true,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // console.log("Log entry", logEntry);

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
    debug: (msg: string, args = {} ) => queueLog('debug', msg, args),
    info: (msg: string, args = {}) => queueLog('info', msg, args),
    warn: (msg: string, args = {}) => queueLog('warn', msg, args),
    error: (msg: string, args = {}, err = {}) => queueLog('error', msg, args, err),
    fatal: (msg: string, args = {}, err = {}) => queueLog('fatal', msg, args, err),
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
        error: (msg: string, args = {}, err = {}) => queueLog('error', msg, { ...bindings, ...args}, err),
        fatal: (msg: string, args = {}, err = {}) => queueLog('fatal', msg, { ...bindings, ...args }, err),
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
// export const logger = isClient ? clientLoggerInstance! : getServerLogger();

// Helper to create contextual loggers
export function getLogger(context: string | Object) {
  return isClient 
    ? clientLoggerInstance!.child({ context }) 
    : getServerLogger();
}