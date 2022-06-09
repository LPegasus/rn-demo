import { GetUser } from "../../api";
import { useFetchData } from "../../hooks/useFetchData";

export function useMe() {
  return useFetchData(GetUser, [{}]);
}
