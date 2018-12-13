export interface InvokableArgs {
    preamble(): string[];
    createServer(): string[];
    startServer(): string[];
    appServerConfig(): any;
}
