const PROLOG_ADDRESS = "http://localhost:8000/";
const DROLLS_ADDRESS = "http://localhost:8080/api/";

type SystemAddressType = "PROLOG" | "DROLLS";

export default function GetSystemAddress(type: SystemAddressType) {
  return type === "PROLOG" ? PROLOG_ADDRESS : DROLLS_ADDRESS;
}
