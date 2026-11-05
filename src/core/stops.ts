/**
 * Registry of “stops”: scroll positions a presenter can jump between with ←/→ or a clicker.
 * Normal sections contribute their top offset; horizontal scrollers contribute one stop per panel.
 */
type StopProvider = () => number[];

const providers: StopProvider[] = [];

export const registerStops = (provider: StopProvider): void => {
  providers.push(provider);
};

export const allStops = (): number[] =>
  [...new Set(providers.flatMap((p) => p()).map((y) => Math.round(Math.max(0, y))))].sort(
    (a, b) => a - b,
  );
