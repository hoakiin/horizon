"use server";

const DWOLLA_KEY = process.env.DWOLLA_KEY!;
const DWOLLA_SECRET = process.env.DWOLLA_SECRET!;
const DWOLLA_BASE_URL = process.env.DWOLLA_BASE_URL!;

async function dwollaFetch(path: string, options: RequestInit = {}) {
  const token = await getAccessToken();

  const url = path.startsWith("http")
    ? path
    : `${DWOLLA_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.dwolla.v1.hal+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.text();
  const parsed = body ? JSON.parse(body) : {};

  if (!res.ok) {
    throw new Error(parsed.message || `Dwolla error ${res.status}`);
  }

  return { status: res.status, headers: res.headers, body: parsed };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(`${DWOLLA_KEY}:${DWOLLA_SECRET}`).toString(
    "base64"
  );

  const res = await fetch(`${DWOLLA_BASE_URL}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dwolla auth failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    const res = await dwollaFetch("customers", {
      method: "POST",
      body: JSON.stringify(newCustomer),
    });
    return res.headers.get("location");
  } catch (err) {
    console.error("Creating a Dwolla Customer Failed: ", err);
  }
};

export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    const res = await dwollaFetch(
      `customers/${options.customerId}/funding-sources`,
      {
        method: "POST",
        body: JSON.stringify({
          name: options.fundingSourceName,
          plaidToken: options.plaidToken,
        }),
      }
    );
    return res.headers.get("location");
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const res = await dwollaFetch("on-demand-authorizations", {
      method: "POST",
    });
    return res.body._links;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", err);
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const res = await dwollaFetch("transfers", {
      method: "POST",
      body: JSON.stringify({
        _links: {
          source: { href: sourceFundingSourceUrl },
          destination: { href: destinationFundingSourceUrl },
        },
        amount: { currency: "USD", value: amount },
      }),
    });
    return res.headers.get("location");
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    const dwollaAuthLinks = await createOnDemandAuthorization();

    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};
