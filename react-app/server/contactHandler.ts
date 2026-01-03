import { Resend } from "resend";

export interface ContactPayload {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    company?: string;
    website?: string;
    reason?: string;
    eventName?: string;
    eventDateTime?: string;
    eventLocation?: string;
    audienceSize?: string;
    message?: string;
}

export interface ContactHandlerResult {
    status: number;
    body: Record<string, unknown>;
}

const REQUIRED_FIELDS: Array<keyof ContactPayload> = [
    "fullName",
    "email",
    "phoneNumber",
    "reason",
    "eventName",
    "eventLocation",
    "audienceSize",
];

const sanitize = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const normaliseInput = (payload: ContactPayload) => {
    const base: Record<keyof ContactPayload, string> = {
        fullName: "",
        email: "",
        phoneNumber: "",
        company: "",
        website: "",
        reason: "",
        eventName: "",
        eventDateTime: "",
        eventLocation: "",
        audienceSize: "",
        message: "",
    };

    for (const [key, value] of Object.entries(payload)) {
        if (key in base) {
            base[key as keyof ContactPayload] =
                typeof value === "string" ? value.trim() : "";
        }
    }

    return base;
};

export async function handleContact(
    payload: ContactPayload
): Promise<ContactHandlerResult> {
    if (!payload || typeof payload !== "object") {
        return {
            status: 400,
            body: { error: "Invalid request body." },
        };
    }

    const normalised = normaliseInput(payload);

    const {
        fullName,
        email,
        phoneNumber,
        company,
        website,
        reason,
        eventName,
        eventDateTime,
        eventLocation,
        audienceSize,
        message,
    } = normalised;

    const shouldMock =
        process.env.CONTACT_DEV_MODE === "true" ||
        (!process.env.RESEND_API_KEY && process.env.NODE_ENV !== "production");

    const missingField = REQUIRED_FIELDS.find(
        (field) => normalised[field].length === 0
    );

    if (missingField) {
        return {
            status: 400,
            body: { error: "Missing required fields." },
        };
    }

    if (shouldMock) {
        console.info(
            "[contactHandler] Mock email send enabled. Payload:",
            JSON.stringify(normalised, null, 2)
        );
        return {
            status: 200,
            body: { ok: true, mocked: true },
        };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_RECIPIENT_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !to || !from) {
        return {
            status: 500,
            body: {
                error: "Email provider is not configured correctly.",
            },
        };
    }

    const resend = new Resend(apiKey);
    const recipients = to.split(",").map((address) => address.trim());
    const safeMessage = sanitize(message ?? "").replace(/\n/g, "<br/>");

    const emailHtml = `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${sanitize(fullName ?? "")}</p>
        <p><strong>Email:</strong> ${sanitize(email ?? "")}</p>
        <p><strong>Phone Number:</strong> ${sanitize(phoneNumber ?? "")}</p>
        <p><strong>Company/Band:</strong> ${sanitize(company ?? "—")}</p>
        <p><strong>Website/Social:</strong> ${sanitize(website ?? "—")}</p>
        <p><strong>Reason:</strong> ${sanitize(reason ?? "—")}</p>
        <p><strong>Event Name:</strong> ${sanitize(eventName ?? "—")}</p>
        <p><strong>Event Date & Time:</strong> ${sanitize(
            eventDateTime ?? "—"
        )}</p>
        <p><strong>Event Location:</strong> ${sanitize(eventLocation ?? "—")}</p>
        <p><strong>Expected Audience Size:</strong> ${sanitize(
            audienceSize ?? "—"
        )}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage || "—"}</p>
    `;

    try {
        await resend.emails.send({
            from,
            to: recipients,
            reply_to: email,
            subject: `New contact from ${fullName}`,
            html: emailHtml,
        });

        return {
            status: 200,
            body: { ok: true },
        };
    } catch (error) {
        console.error("Failed to send contact email", error);
        return {
            status: 502,
            body: { error: "Unable to send email. Please try again later." },
        };
    }
}
