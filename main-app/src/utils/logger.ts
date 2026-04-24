/**
 * Log-Level für die Log-Ausgaben definieren:
 * INFO: 1000
 * DEBUG: 2000
 * WARNING: 3000
 * ERROR: 4000
 * ALL: 5000
 * 
 */
const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL ? Number(import.meta.env.VITE_LOG_LEVEL) : 1000;


/**
 * Standard-Logger für konsistentes und typsicheres Logging.
 * Usage: const logger = new Logger('MyComponent');
 */
export class Logger {
  private readonly componentName: string;

  constructor(componentName: string) {
    this.componentName = componentName;
  }

  /**
   * Erstellt eine formatierte Log-Nachricht mit Kontext
   */
  private formatMessage(message: string): string {
    return `[${this.componentName}]: ${message}`;
  }

  public debug(message: string, data?: unknown): void {
    if (LOG_LEVEL === 2000 || LOG_LEVEL === 5000) {
      const style = 'color: #299be2; font-weight: normal;';
      console.groupCollapsed(`%cDEBUG ${this.formatMessage(message)}`, style);
      if (data !== undefined) {
        console.log(`%c${JSON.stringify(data)}`, style);
      }
      console.groupEnd();
    }
  }

  public info(message: string, data?: unknown): void {
    if (LOG_LEVEL === 1000 || LOG_LEVEL === 5000) {
      const style = 'color: #21f352; font-weight: normal;';
      console.info(`%cINFO  ${this.formatMessage(message)}`, style, data ?? '');
    }
  }

  public warn(message: string, data?: unknown): void {
    if (LOG_LEVEL === 3000 || LOG_LEVEL === 5000) {
      const style = 'color: #ff9800; font-weight: normal;';
      console.warn(`%cWARN  ${this.formatMessage(message)}`, style, data ?? '');
    }
  }

  public error(message: string, error?: unknown): void {
    if (LOG_LEVEL === 4000 || LOG_LEVEL === 5000) {
      const style = 'color: #f44336; font-weight: normal;';
      console.error(`%cERROR ${this.formatMessage(message)}`, style);
      if (error) {
        console.error(error); // Stack Trace wird hier ausgegeben
      }
    }
  }
}
