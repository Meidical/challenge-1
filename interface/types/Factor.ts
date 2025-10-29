export type FactorCategory = "LEMON" | "MOANS" | "RODS" | "SHORT";

export type Factor = {
  category: FactorCategory;
  code: string;
  present: boolean;
};
