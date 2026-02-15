/**
 * Prüft, ob die Anwendung im Debug-Mode aktiv ist.
 */
const IS_DEBUG = import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true';

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
    if (IS_DEBUG) {
      const style = 'color: #4caf50; font-weight: bold;';
      console.groupCollapsed(`%cDEBUG ${this.formatMessage(message)}`, style);
      if (data !== undefined) {
        console.log(data);
      }
      console.groupEnd();
    }
  }

  public info(message: string, data?: unknown): void {
    const style = 'color: #2196f3; font-weight: bold;';
    console.info(`%cINFO  ${this.formatMessage(message)}`, style, data ?? '');
  }

  public warn(message: string, data?: unknown): void {
    const style = 'color: #ff9800; font-weight: bold;';
    console.warn(`%cWARN  ${this.formatMessage(message)}`, style, data ?? '');
  }

  public error(message: string, error?: unknown): void {
    const style = 'color: #f44336; font-weight: bold;';
    console.error(`%cERROR ${this.formatMessage(message)}`, style);
    if (error) {
      console.error(error); // Stack Trace wird hier ausgegeben
    }
  }
}
