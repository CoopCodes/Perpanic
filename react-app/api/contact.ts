import { handleContact, type ContactPayload } from "../server/contactHandler";

type VercelRequest = {
    method?: string;
    body?: unknown;
};

type VercelResponse = {
    status: (statusCode: number) => VercelResponse;
    json: (body: Record<string, unknown>) => void;
    send: (body?: unknown) => void;
    setHeader: (name: string, value: string) => void;
};

const sendJson = (
    res: VercelResponse,
    statusCode: number,
    body: Record<string, unknown>
) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.status(statusCode).json(body);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
        res.status(204).send("");
        return;
    }

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        sendJson(res, 405, { error: "Method not allowed." });
        return;
    }

    let payload: ContactPayload;

    try {
        if (req.body && typeof req.body === "object") {
            payload = req.body as ContactPayload;
        } else if (typeof req.body === "string" && req.body.length > 0) {
            payload = JSON.parse(req.body);
        } else {
            payload = {};
        }
    } catch (error) {
        console.error("Invalid JSON body", error);
        sendJson(res, 400, { error: "Invalid JSON body." });
        return;
    }

    const result = await handleContact(payload);
    sendJson(res, result.status, result.body);
}

