import { HooksRegistry, Symbols } from './Registry';

function DatabaseHook() {
  const mongoose = HooksRegistry.get(Symbols.Database);

  if (!mongoose) throw new Error('Mongoose has not been initialized');

  return mongoose;
}

export { DatabaseHook }