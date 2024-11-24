import { getApiClient } from "./apiServices.js";

const action = getApiClient().api["get-winners"].$get;

export async function submit() {
    return await action();
}