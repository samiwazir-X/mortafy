import { NextRequest, NextResponse } from "next/server";
import {
  CreditScoreTier,
  LeadSubmissionPayload,
  PurchaseTimeline,
} from "@/lib/types";

interface StoredLeadRecord extends LeadSubmissionPayload {
  leadId: string;
  receivedAtServer: string;
  webhookStatus: "dispatched" | "queued_local";
}

// In-memory store for submitted mortgage leads during server runtime
const IN_MEMORY_LEADS: StoredLeadRecord[] = [];

const VALID_CREDIT_TIERS: CreditScoreTier[] = [
  "excellent",
  "good",
  "fair",
  "rebuilding",
];

const VALID_TIMELINES: PurchaseTimeline[] = [
  "ready",
  "30-60_days",
  "3-6_months",
  "refinance",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

/**
 * Extensible webhook dispatcher ready for LendingTree, Zapier, HubSpot, or custom Broker CRMs.
 */
async function dispatchToBrokerWebhook(
  lead: StoredLeadRecord
): Promise<"dispatched" | "queued_local"> {
  const webhookUrl = process.env.MORTAFY_BROKER_WEBHOOK_URL;
  if (!webhookUrl) {
    return "queued_local";
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Mortafy-Source": "Mortafy-PreQual-Engine-v1",
      },
      body: JSON.stringify(lead),
    });
    return res.ok ? "dispatched" : "queued_local";
  } catch {
    return "queued_local";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<LeadSubmissionPayload>;

    const fullName = (body.fullName ?? "").trim();
    const email = (body.email ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const propertyZipOrCity = (body.propertyZipOrCity ?? "").trim();

    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter your full legal name.",
        },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!phone || !PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid phone number (7–20 digits).",
        },
        { status: 400 }
      );
    }

    if (body.consentGranted !== true) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Legal compliance consent is required to receive personalized rate quotes.",
        },
        { status: 400 }
      );
    }

    const creditScoreTier: CreditScoreTier = VALID_CREDIT_TIERS.includes(
      body.creditScoreTier as CreditScoreTier
    )
      ? (body.creditScoreTier as CreditScoreTier)
      : "good";

    const purchaseTimeline: PurchaseTimeline = VALID_TIMELINES.includes(
      body.purchaseTimeline as PurchaseTimeline
    )
      ? (body.purchaseTimeline as PurchaseTimeline)
      : "30-60_days";

    const leadId = `MTF-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    const record: StoredLeadRecord = {
      leadId,
      countryCode: body.countryCode ?? "US",
      currency: body.currency ?? "USD",
      homePrice: Number(body.homePrice) || 0,
      downPayment: Number(body.downPayment) || 0,
      loanAmount: Number(body.loanAmount) || 0,
      monthlyPayment: Number(body.monthlyPayment) || 0,
      interestRate: Number(body.interestRate) || 0,
      creditScoreTier,
      purchaseTimeline,
      propertyZipOrCity: propertyZipOrCity || "Not Specified",
      annualIncome: Number(body.annualIncome) || 0,
      fullName,
      email,
      phone,
      consentGranted: true,
      submittedAt: body.submittedAt || new Date().toISOString(),
      receivedAtServer: new Date().toISOString(),
      webhookStatus: "queued_local",
    };

    record.webhookStatus = await dispatchToBrokerWebhook(record);
    IN_MEMORY_LEADS.push(record);

    // Log formatted JSON to stdout for audit & pipeline observability
    console.info(
      "[Mortafy Lead Capture Engine] New Soft Pre-Qualification Lead:",
      JSON.stringify(record, null, 2)
    );

    return NextResponse.json(
      {
        success: true,
        leadId: record.leadId,
        webhookStatus: record.webhookStatus,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Mortafy Lead Capture Engine] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request payload. Please verify your inputs and retry.",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      service: "Mortafy Lead Capture & Soft Pre-Qualification Engine",
      totalStoredInSession: IN_MEMORY_LEADS.length,
    },
    { status: 200 }
  );
}
