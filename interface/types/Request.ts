import { Factor } from "./Factor";

export type PrevisionPost = {
  lemonFactors: Factor[];
  moansFactors: Factor[];
  rodsFactors: Factor[];
  shortFactors: Factor[];
};

export type PrevisionResponse = {
  lemonCF: number;
  moansCF: number;
  rodsCF: number;
  shortCF: number;
  difficultAirwayPredicted: boolean;
  recommendedApproach: string;
  nextFactId: number;
};

export type InstructionPost = {
  factId: number;
  value: boolean;
};

export type InstructionResponse = {
  nextFactId: number;
  recommendedApproach: string;
};
