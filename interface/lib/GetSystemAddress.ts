const PROLOG_ADDRESS = "http://localhost:8000/";
const DROLLS_ADDRESS = "http://localhost:8080/";

type SystemAddressType = "PROLOG" | "DROLLS";

export default function SystemAddress(type: SystemAddressType) {
  return type === "PROLOG" ? PROLOG_ADDRESS : DROLLS_ADDRESS;
}
