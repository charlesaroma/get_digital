import { queryOptions, useQuery } from "@tanstack/react-query";
import { listNominees } from "../../services/voting/nomineesApi";
import { listPolls } from "../../services/voting/pollsApi";
import { siteRoot } from "../keys";

export const pollsQuery = () => queryOptions({ queryKey: [...siteRoot, "polls"], queryFn: ({ signal }) => listPolls({ signal }) });
export const nomineesQuery = () => queryOptions({ queryKey: [...siteRoot, "nominees"], queryFn: ({ signal }) => listNominees({ signal }) });
export const usePolls = () => useQuery(pollsQuery());
export const useNominees = () => useQuery(nomineesQuery());
