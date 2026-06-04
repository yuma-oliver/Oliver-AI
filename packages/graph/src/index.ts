import {
  PublicClientApplication,
  type AuthenticationResult,
  type Configuration,
} from "@azure/msal-browser";

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

const SCOPES = ["User.Read", "Mail.Read", "Calendars.Read", "Chat.Read", "ChannelMessage.Read.All"];

let msalInstance: PublicClientApplication | null = null;

function getMsalInstance(): PublicClientApplication {
  if (msalInstance) return msalInstance;

  const clientId = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_AZURE_CLIENT_ID ?? "";
  const tenantId = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_AZURE_TENANT_ID ?? "";

  const config: Configuration = {
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: window.location.origin,
    },
    cache: { cacheLocation: "localStorage" },
  };

  msalInstance = new PublicClientApplication(config);
  return msalInstance;
}

export async function initMsal(): Promise<void> {
  const msal = getMsalInstance();
  await msal.initialize();
  await msal.handleRedirectPromise();
}

export async function signIn(): Promise<AuthenticationResult> {
  const msal = getMsalInstance();
  await msal.initialize();
  return msal.loginPopup({ scopes: SCOPES });
}

export async function signOut(): Promise<void> {
  const msal = getMsalInstance();
  await msal.initialize();
  const accounts = msal.getAllAccounts();
  if (accounts.length > 0) {
    await msal.logoutPopup({ account: accounts[0] });
  }
}

export async function getAccessToken(): Promise<string> {
  const msal = getMsalInstance();
  await msal.initialize();
  const accounts = msal.getAllAccounts();
  if (accounts.length === 0) throw new Error("Not signed in");

  const result = await msal.acquireTokenSilent({
    scopes: SCOPES,
    account: accounts[0],
  });
  return result.accessToken;
}

export function getCurrentUser() {
  try {
    const msal = getMsalInstance();
    const accounts = msal.getAllAccounts();
    return accounts[0] ?? null;
  } catch {
    return null;
  }
}

async function graphFetch<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${GRAPH_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph API error ${res.status}: ${err.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export interface TeamsMessage {
  id: string;
  body: { content: string; contentType: string };
  from: { user: { displayName: string; userPrincipalName: string } };
  createdDateTime: string;
  webUrl: string;
  channelIdentity?: { channelId: string; teamId: string };
  chatId?: string;
}

export async function getTeamsMentions(
  token: string,
  afterDateTime?: string
): Promise<TeamsMessage[]> {
  const after = afterDateTime ?? new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const body = {
    requests: [
      {
        entityTypes: ["chatMessage"],
        query: {
          queryString: `mentions:me AND createdDateTime>=${after}`,
        },
        from: 0,
        size: 25,
      },
    ],
  };

  const result = await graphFetch<{ value: Array<{ hitsContainers: Array<{ hits: Array<{ resource: TeamsMessage }> }> }> }>(
    "/search/query",
    token,
    { method: "POST", body: JSON.stringify(body) }
  );

  const hits = result.value?.[0]?.hitsContainers?.[0]?.hits ?? [];
  return hits.map((h) => h.resource);
}

export interface CalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  organizer: { emailAddress: { name: string } };
  isAllDay: boolean;
}

export async function getCalendarEvents(token: string): Promise<CalendarEvent[]> {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const params = new URLSearchParams({
    startDateTime: now.toISOString(),
    endDateTime: endOfDay.toISOString(),
    $orderby: "start/dateTime",
    $top: "20",
  });

  const result = await graphFetch<{ value: CalendarEvent[] }>(
    `/me/calendarView?${params}`,
    token
  );
  return result.value ?? [];
}

export interface Email {
  id: string;
  subject: string;
  from: { emailAddress: { name: string; address: string } };
  receivedDateTime: string;
  importance: string;
  isRead: boolean;
  bodyPreview: string;
}

export async function getEmails(token: string): Promise<Email[]> {
  const params = new URLSearchParams({
    "$filter": "isRead eq false",
    "$orderby": "receivedDateTime desc",
    "$top": "20",
    "$select": "id,subject,from,receivedDateTime,importance,isRead,bodyPreview",
  });

  const result = await graphFetch<{ value: Email[] }>(
    `/me/messages?${params}`,
    token
  );
  return result.value ?? [];
}
