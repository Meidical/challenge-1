import { Factor } from "./Factor";

export type PrevisionPost = {
  lemonFactors: Factor[];
  moansFactors: Factor[];
  rodsFactors: Factor[];
  shortFactors: Factor[];
};

export type PrevisionResponse = {
  lemonCf: number;
  moansCf: number;
  rodsCf: number;
  shortCf: number;
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
