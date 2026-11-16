/* Admin hooks. The admin realm has its own cache keys so it never mixes with the public site.
   In real mode each call carries the staff token; the server checks the role on every request. */
import { useMutation, useQuery } from "@tanstack/react-query";
import { signIn } from "../../services/admin/authApi";
import { listBlogs } from "../../services/content/blogsApi";
import { listEvents } from "../../services/tickets/eventsApi";
import { listTicketOrders } from "../../services/tickets/ordersApi";
import { listTicketTypes } from "../../services/tickets/ticketTypesApi";
import { listNominees } from "../../services/voting/nomineesApi";
import { listPolls } from "../../services/voting/pollsApi";
import { adminRoot } from "../keys";

export const useStaffSignIn = () => useMutation({ mutationFn: signIn });

/** Everything the overview needs in one cached call. */
export const useAdminOverview = () =>
  useQuery({
    queryKey: [...adminRoot, "overview"],
    refetchInterval: 30_000,
    queryFn: async ({ signal }) => {
      const [polls, nominees, events, types, orders, blogs] = await Promise.all([
        listPolls({ signal }), listNominees({ signal }), listEvents({ signal }), listTicketTypes({ signal }), listTicketOrders({ signal }), listBlogs({ signal }),
      ]);
      return { polls, nominees, events, types, orders, blogs };
    },
  });
