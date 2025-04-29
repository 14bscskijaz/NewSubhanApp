import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const logData = await request.json();
    
    // Add additional context to the log
    const enhancedLog = {
      ...logData,
      source: 'client',
      timestamp: new Date().toISOString(),
    };

    // console.log('State of globalThis.logger', globalThis.logger);
    
    // Use the server-side logger to forward client logs to Loki
    // This uses the global logger set up in instrumentation.ts
    if (globalThis?.logger) {
      const level = logData.level || 'info';
      const message = logData.message || 'Client log';
      
      // Remove level and message from the metadata
      const { level: _, message: __, ...metadata } = enhancedLog;
      
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
          globalThis.logger.error({metadata, message});
          break;
        case 'fatal':
          globalThis.logger.fatal({metadata, message});
          break;
        default:
          globalThis.logger.info({metadata, message});
      }
    } else {
      // Fallback if logger is not available
      console.log('[Client Log]', enhancedLog);
    }
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing client log:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to process log' },
      { status: 500 }
    );
  }
}