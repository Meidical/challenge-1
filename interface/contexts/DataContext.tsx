import { GetSystemAddress } from "@/lib";
import { InstructionResponse, PrevisionResponse } from "@/types";
import { createContext, useContext, useRef, useState } from "react";

type DataContextProps = {
  currentAddress: React.MutableRefObject<string | null>;

  isPredictionDone: boolean;
  setIsPredictionDone: React.Dispatch<React.SetStateAction<boolean>>;

  data: PrevisionResponse | InstructionResponse | null;
  setData: React.Dispatch<
    React.SetStateAction<PrevisionResponse | InstructionResponse | null>
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
  const [data, setData] = useState<
    PrevisionResponse | InstructionResponse | null
  >(null);
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
    setIsLoading,
    isSuccess,
    setIsSuccess,
    isError,
    setIsError,
  } = useContext(DataContext);

  const fullReset = () => {
    setIsPredictionDone(false);
    setData(null);
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
  };

  const resetData = () => {
    setData(null);
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
    data,
    setData,
    isLoading,
    setIsLoading,
    isSuccess,
    setIsSuccess,
    isError,
    setIsError,
  };
};
