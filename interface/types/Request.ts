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
};

export type InstructionPost = {
  nextFactId: number;
  nextFactDescription: string;
  recommendedApproach: string;
};

export type InstructionResponse = {
  nextFactId: number;
  nextFactDescription: string;
  recommendedApproach: string;
};
