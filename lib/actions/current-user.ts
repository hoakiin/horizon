import "server-only";
import { cache } from "react";
import { getLoggedInUser as getLoggedInUserFromActions } from "./user.actions";

export const getLoggedInUser = cache(getLoggedInUserFromActions);