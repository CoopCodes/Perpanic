import { handleContact, type ContactPayload } from "../../server/contactHandler";

interface NetlifyEvent {
    httpMethod: string;
    body: string | null;
}

interface NetlifyResponse {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
}

const defaultHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
};

const createResponse = (
    statusCode: number,
    body: Record<string, unknown>
): NetlifyResponse => ({
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify(body),
});

export const handler = async (
    event: NetlifyEvent
): Promise<NetlifyResponse> => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: defaultHeaders,
            body: "",
        };
    }

    if (event.httpMethod !== "POST") {
        return createResponse(405, { error: "Method not allowed." });
    }

    let payload: ContactPayload;

    try {
        payload = event.body ? JSON.parse(event.body) : {};
    } catch (error) {
        console.error("Invalid JSON body", error);
        return createResponse(400, { error: "Invalid JSON body." });
    }

    const result = await handleContact(payload);
    return createResponse(result.status, result.body);
};
