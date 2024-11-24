import { getApiClient } from "./apiServices.js";

const action = getApiClient().api.buyers.$get;

export async function submit() {
    return await action();
}