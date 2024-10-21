const HooksRegistry = new Map<symbol, unknown>();

const Symbols = {
    Client: Symbol('Client'),
    Database: Symbol('Database'),
};

export { HooksRegistry, Symbols }