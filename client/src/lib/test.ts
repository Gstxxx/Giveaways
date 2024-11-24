import { getApiClient } from "./apiServices.js";

const action = getApiClient().api.test.$get;

export async function submit() {
    return await action();
}