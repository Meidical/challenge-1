import { GetSystemAddress } from "@/lib";
import { InstructionResponse, PrevisionResponse } from "@/types";
import { createContext, useContext, useRef, useState } from "react";

type DataContextProps = {
  currentAddress: React.MutableRefObject<string | null>;

  isPredictionDone: boolean;
  setIsPredictionDone: React.Dispatch<React.SetStateAction<boolean>>;

  data: PrevisionResponse | null;
  setData: React.Dispatch<React.SetStateAction<PrevisionResponse | null>>;

  instructionData: InstructionResponse | null;
  setInstructionData: React.Dispatch<
    React.SetStateAction<InstructionResponse | null>
  >;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  isSuccess: boolean;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;

  isError: boolean;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
};

const DataContext = createContext<DataContextProps>({
  currentAddress: null,
  isPredictionDone: false,
  setIsPredictionDone: () => {},
  instructionData: null,
  setInstructionData: () => {},
  data: null,
  setData: () => {},
  isLoading: false,
  setIsLoading: () => {},
  isSuccess: false,
  setIsSuccess: () => {},
  isError: false,
  setIsError: () => {},
});

export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentAddress = useRef<string | null>(GetSystemAddress("PROLOG"));
  const [data, setData] = useState<PrevisionResponse | null>(null);
  const [instructionData, setInstructionData] =
    useState<InstructionResponse | null>(null);
  const [isPredictionDone, setIsPredictionDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <DataContext.Provider
      value={{
        isPredictionDone,
        setIsPredictionDone,
        currentAddress,
        data,
        setData,
        instructionData,
        setInstructionData,
        isLoading,
        setIsLoading,
        isSuccess,
        setIsSuccess,
        isError,
        setIsError,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => {
  const {
    isPredictionDone,
    setIsPredictionDone,
    currentAddress,
    data,
    setData,
    isLoading,
    instructionData,
    setInstructionData,
    setIsLoading,
    isSuccess,
    setIsSuccess,
    isError,
    setIsError,
  } = useContext(DataContext);

  const fullReset = () => {
    setIsPredictionDone(false);
    setInstructionData(null);
    resetData();
  };

  const resetData = () => {
    setData(null);
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
  };

  const resetInstructionData = () => {
    setInstructionData(null);
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
  };

  return {
    fullReset,
    isPredictionDone,
    setIsPredictionDone,
    currentAddress,
    resetData,
    resetInstructionData,
    data,
    setData,
    instructionData,
    setInstructionData,
    isLoading,
    setIsLoading,
    isSuccess,
    setIsSuccess,
    isError,
    setIsError,
  };
};
