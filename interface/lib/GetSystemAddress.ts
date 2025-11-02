const PROLOG_ADDRESS = "http://localhost:8081/api";
const DROLLS_ADDRESS = "http://localhost:8080/api";

type SystemAddressType = "PROLOG" | "DROLLS";

export default function GetSystemAddress(type: SystemAddressType) {
  return type === "PROLOG" ? PROLOG_ADDRESS : DROLLS_ADDRESS;
}

export function GetSystemTypeFromCurrentAddress(address: string) {
  return address === PROLOG_ADDRESS ? "PROLOG" : "DROLLS";
}

export function GetJustificationEndpoint(
  type: SystemAddressType,
  patientId: string,
  justificationId?: string
) {
  return type === "PROLOG"
    ? `/explain?patientId=${patientId}&id=${justificationId}`
    : `/assessment/${patientId}/how`;
}
