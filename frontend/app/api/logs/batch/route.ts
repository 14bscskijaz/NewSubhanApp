import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { logs } = await request.json();
    
    if (!Array.isArray(logs) || logs.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid log batch format' },
        { status: 400 }
      );
    }
    
    // Process each log in the batch
    for (const logData of logs) {
      // Add additional context to the log
      const enhancedLog = {
        ...logData,
        source: 'client',
        batch: true,
      };
      
      // Use the server-side logger to forward client logs to Loki
      if (globalThis?.logger) {
        const level = enhancedLog.level || 'info';
        const message = enhancedLog.message || 'Client log not found.';

        // Remove level and message from the metadata
        const { level: _, message: __, error: error, ...metadata } = enhancedLog;
        // console.log("The error object in the log"); 
        // console.log(error);
        // Log with the appropriate level
        switch(level) {
          case 'trace':
            globalThis.logger.trace({metadata, message});
            break;
          case 'debug':
            globalThis.logger.debug({metadata, message});
            break;
          case 'info':
            globalThis.logger.info({metadata, message});
            break;
          case 'warn':
            globalThis.logger.warn({metadata, message});
            break;
          case 'error':
            globalThis.logger.error({err: error, metadata, message});
            break;
          case 'fatal':
            globalThis.logger.fatal({err: error, metadata, message});
            break;
          default:
            globalThis.logger.info({metadata, message});
        }
      } else {
        // Fallback if logger is not available
        console.log('[Client Log Batch]', enhancedLog);
      }
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: `Processed ${logs.length} logs` 
    });
  } catch (error) {
    console.error('Error processing client log batch:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to process log batch' },
      { status: 500 }
    );
  }
}