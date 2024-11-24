import { InferRequestType } from "hono/client";
import { getApiClient } from "./apiServices.js";

const action = getApiClient().api.buyer.$post;

type Request = InferRequestType<typeof action>["json"];
export async function submit(data: Request) {
    return await action({
        json: data
    });
}