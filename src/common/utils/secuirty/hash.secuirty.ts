import { compare, hash } from 'bcrypt';

export const generatHash = async (
  plainText: string,
  saltRound: number = parseInt(process.env.SALT as string),
): Promise<string> => {
  return await hash(plainText, saltRound);
};

export const compareHash = async (
  plainText: string,
  hashValue: string,
): Promise<boolean> => {
  return await compare(plainText, hashValue);
};
