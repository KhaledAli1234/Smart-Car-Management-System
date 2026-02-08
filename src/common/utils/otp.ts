export const createNumericalOtp = (): string => {
  return String(Math.floor(Math.random() * (999999 - 100000 + 1) + 100000));
};