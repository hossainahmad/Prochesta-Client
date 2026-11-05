/**
 * End-to-end smoke test for Volunify (client + server split).
 * Usage: node scripts/e2e-test.mjs [clientUrl] [serverUrl]
 *   default: http://localhost:3000 client, http://localhost:3001 server
 * Requirements: production/dev client running + API server running + seeded DB.
 */
const CLIENT = process.argv[2] || "http://localhost:3000";
const API = process.argv[3] || "http://localhost:3001";
const out = {};
let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; out[name] = "PASS"; }
  else { fail++; out[name] = `FAIL ${extra ? JSON.stringify(extra) : ""}`; }
}

const UNIQ = Date.now().toString(36);
const AGENT = { email: `agent-${UNIQ}@test.dev`, password: "Agent123", name: "Test Agent" };
const DEMO = { email: "demo@volunify.test", password: "Demo1234" };

class Session {
  cookies = new Set();
  addSetCookie(res) {
    for (const c of res.headers.getSetCookie()) {
      const kv = c.split(";")[0];
      const name = kv.split("=")[0];
      if (kv.endsWith("=")) {
        // Cleared cookie (empty value) — drop every jar entry for that name
        for (const existing of [...this.cookies]) {
          if (existing.split("=")[0] === name) this.cookies.delete(existing);
        }
      } else {
        for (const existing of [...this.cookies]) {
          if (existing.split("=")[0] === name) this.cookies.delete(existing);
        }
        this.cookies.add(kv);
      }
    }
  }
  header() { return [...this.cookies].join("; "); }
}

async function api(path, { method = "GET", body, session } = {}, base = API) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (session) headers["Cookie"] = session.header();
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined, redirect: "manual" });
  if (session) session.addSetCookie(res);
  let json = null;
  try { json = await res.json(); } catch {}
  return { res, json };
}

async function login(email, password) {
  const s = new Session();
  const r = await api("/api/auth/login", {
    method: "POST", body: { email, password }, session: s,
  });
  return { session: s, ok: r.res.status === 200 && /auth_token/.test(s.header()), json: r.json };
}

// ---------- 1. Server health & public endpoints ----------
const health = await api("/api");
check("GET /api health returns ok", health.res.status === 200 && health.json?.status === "ok", health.json);

const mw = await fetch(CLIENT + "/create-event", { redirect: "manual" });
check("client middleware redirects protected page to /login when logged out",
  mw.status === 307 && mw.headers.get("location")?.includes("/login"),
  { status: mw.status, loc: mw.headers.get("location") });

const list = await api("/api/events?limit=6");
check("GET /api/events?limit=6 returns ≤6 future events", list.res.status === 200 && (list.json?.events?.length || 0) <= 6, list.json);
check("listed events are in the future", list.json?.events?.every(e => new Date(e.eventDate) > new Date()));
const seededEventId = list.json?.events?.[0]?.id;

const search = await api("/api/events?search=winter");
check("event search works (case-insensitive)", search.res.status === 200 && search.json?.events?.every(e => JSON.stringify(e).toLowerCase().includes("winter")), search.json?.events?.length);

const single = await api(`/api/events/${seededEventId}`);
check("GET /api/events/:id public detail works", single.res.status === 200 && single.json?.event?.title, single.json);
const comment404 = await api("/api/events/does-not-exist");
check("unknown event id → 404", comment404.res.status === 404);

const noAuth = await Promise.all([
  api("/api/events", { method: "POST", body: {} }),
  api("/api/my-events"),
  api("/api/joined-events"),
]);
check("protected APIs return 401 when logged out", noAuth.every(r => r.res.status === 401), noAuth.map(r => r.res.status));

// ---------- 2. Registration ----------
const weak = await api("/api/auth/register", { method: "POST", body: { name: "Weak", email: `weak-${UNIQ}@test.dev`, password: "abcde" } });
check("weak password rejected (min 6)", weak.res.status === 400, weak.json);

const weakUpper = await api("/api/auth/register", { method: "POST", body: { name: "Weak2", email: `weak2-${UNIQ}@test.dev`, password: "abcdef" } });
check("password without uppercase rejected", weakUpper.res.status === 400, weakUpper.json);

const reg = await api("/api/auth/register", { method: "POST", body: { ...AGENT, photoURL: "https://i.pravatar.cc/150?u=a" } });
check("valid registration works", reg.res.status === 201, reg.json);

const dup = await api("/api/auth/register", { method: "POST", body: AGENT });
check("duplicate email register rejected with 409", dup.res.status === 409, dup.json);

// ---------- 3. Login / logout ----------
const badLogin = await login(AGENT.email, "WrongPass1");
check("bad credentials → no auth cookie", !badLogin.ok);

const agent = await login(AGENT.email, AGENT.password);
check("login sets auth_token cookie", agent.ok, agent.json);

const me = await api("/api/auth/me", { session: agent.session });
check("GET /api/auth/me returns the user", me.res.status === 200 && me.json?.user?.email === AGENT.email, me.json);

const noMe = await api("/api/auth/me");
check("/api/auth/me without cookie → 401", noMe.res.status === 401);

const demo = await login(DEMO.email, DEMO.password);
check("demo user login works", demo.ok);

// ---------- 4. Create / validate events ----------
const futureDate = new Date(Date.now() + 5 * 864e5).toISOString();
const create = await api("/api/events", { method: "POST", session: agent.session, body: {
  title: "Agent Test Cleanup", description: "An automated smoke test event created by the E2E test script run.",
  eventType: "Cleanup", thumbnailUrl: "https://example.com/test.jpg",
  location: "Test Location, Dhaka", eventDate: futureDate,
}});
check("create event (logged in) works", create.res.status === 201 && create.json?.event?.id, create.json);
const testEventId = create.json?.event?.id;

const pastDate = await api("/api/events", { method: "POST", session: agent.session, body: {
  title: "Past Date Event", description: "This event has a past date and must fail validation always.",
  eventType: "Cleanup", thumbnailUrl: "https://example.com/t.jpg",
  location: "Test Location, Dhaka", eventDate: "2020-01-01T00:00:00Z",
}});
check("past event date rejected", pastDate.res.status === 400, pastDate.json);

const badType = await api("/api/events", { method: "POST", session: agent.session, body: {
  title: "Bad Type Event", description: "This event uses an invalid event type and should be rejected.",
  eventType: "Flying Lesson", thumbnailUrl: "https://example.com/t.jpg",
  location: "Test Location, Dhaka", eventDate: futureDate,
}});
check("invalid event type rejected", badType.res.status === 400, badType.json);

// ---------- 5. Join flow ----------
const joinOwner = await api(`/api/events/${testEventId}/join`, { method: "POST", session: agent.session });
check("owner cannot join own event (403)", joinOwner.res.status === 403, joinOwner.json);

const joinDemo = await api(`/api/events/${testEventId}/join`, { method: "POST", session: demo.session });
check("other user joins event (201)", joinDemo.res.status === 201, joinDemo.json);

const joinDemoAgain = await api(`/api/events/${testEventId}/join`, { method: "POST", session: demo.session });
check("duplicate join rejected (409)", joinDemoAgain.res.status === 409, joinDemoAgain.json);

const view = await api(`/api/events/${testEventId}`, { session: demo.session });
check("detail shows joinedByMe=true after join", view.json?.joinedByMe === true && view.json?.event?._count?.participants === 1, view.json);
const ownerView = await api(`/api/events/${testEventId}`, { session: agent.session });
check("detail shows isOwner=true for owner / false for others",
  ownerView.json?.isOwner === true && view.json?.isOwner === false, { owner: ownerView.json?.isOwner, demo: view.json?.isOwner });

// ---------- 6. Joined events ----------
const joined = await api("/api/joined-events", { session: demo.session });
const joinedEvents = joined.json?.events ?? [];
const datesSorted = joinedEvents.every((e, i, a) => i === 0 || new Date(a[i-1].eventDate) <= new Date(e.eventDate));
check("joined events list includes test event, sorted by date asc",
  joined.res.status === 200 && datesSorted, { count: joinedEvents.length });

// ---------- 7. Ownership rules ----------
const otherEdit = await api(`/api/events/${testEventId}`, { method: "PUT", session: demo.session, body: {} });
check("non-owner edit rejected (403)", otherEdit.res.status === 403, otherEdit.json);

const otherDelete = await api(`/api/events/${testEventId}`, { method: "DELETE", session: demo.session });
check("non-owner delete rejected (403)", otherDelete.res.status === 403, otherDelete.json);

const edit = await api(`/api/events/${testEventId}`, { method: "PUT", session: agent.session, body: {
  title: "Agent Test Cleanup Updated", description: "The updated description for the e2e smoke test script.",
  eventType: "Donation", thumbnailUrl: "https://example.com/updated.jpg",
  location: "Updated Location, Dhaka", eventDate: new Date(Date.now() + 9 * 864e5).toISOString(),
}});
check("owner edit works", edit.res.status === 200 && edit.json?.event?.title === "Agent Test Cleanup Updated", edit.json);

const myEvents = await api("/api/my-events", { session: agent.session });
check("GET /api/my-events lists only own events", myEvents.res.status === 200 && myEvents.json?.events?.every(e => e.creatorEmail === AGENT.email), myEvents.json?.events?.length);

const del = await api(`/api/events/${testEventId}`, { method: "DELETE", session: agent.session });
check("owner delete works", del.res.status === 200, del.json);

const gone = await api(`/api/events/${testEventId}`);
check("deleted event returns 404", gone.res.status === 404);

// ---------- 8. Profile ----------
const profile = await api("/api/profile", { method: "PUT", session: agent.session, body: { name: "Test Agent Updated", photoURL: "https://i.pravatar.cc/150?u=u" } });
check("profile update works", profile.res.status === 200, profile.json);

const logout = await api("/api/auth/logout", { method: "POST", session: agent.session });
check("logout endpoint works", logout.res.status === 200, logout.json);
const meAfterLogout = await api("/api/auth/me", { session: agent.session });
check("/api/auth/me after logout returns 401", meAfterLogout.res.status === 401, meAfterLogout.res.status);

// ---------- 9. Client pages ----------
const home = await fetch(CLIENT + "/");
const eventsPage = await fetch(CLIENT + "/events");
const loginPage = await fetch(CLIENT + "/login");
check("client home page renders 200", home.status === 200);
check("client /events page renders 200", eventsPage.status === 200);
check("client /login page renders 200", loginPage.status === 200);
const detailPage = await fetch(`${CLIENT}/events/${seededEventId}`);
check("client event details page renders 200", detailPage.status === 200);

out.summary = { pass, fail };
console.log(JSON.stringify(out, null, 2));
process.exit(fail ? 1 : 0);
