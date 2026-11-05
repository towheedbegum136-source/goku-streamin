import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppInstallProvider, useAppInstall } from "./app-install";
import { INSTALL_ACCEPTED_KEY, INSTALL_DISMISSED_KEY } from "./pwa";

vi.mock("./pwa", async (original) => ({
  ...await original<typeof import("./pwa")>(),
  registerAppWorker: vi.fn().mockResolvedValue(undefined),
}));

function Controls() {
  const install = useAppInstall();
  return <>
    <button onClick={() => void install.requestInstall()}>Install App</button>
    <button onClick={install.dismiss}>Dismiss</button>
    <output data-testid="state">{JSON.stringify({ open: install.open, manual: install.manual, installed: install.installed })}</output>
  </>;
}
const state = () => JSON.parse(screen.getByTestId("state").textContent ?? "{}");
function offer(outcome: "accepted" | "dismissed" = "accepted") {
  const prompt = vi.fn().mockResolvedValue(undefined);
  const event = new Event("beforeinstallprompt", { cancelable: true });
  Object.assign(event, { prompt, userChoice: Promise.resolve({ outcome }) });
  act(() => { window.dispatchEvent(event); });
  return prompt;
}
beforeEach(() => {
  localStorage.clear();
  render(<AppInstallProvider><Controls /></AppInstallProvider>);
});
afterEach(cleanup);

it("keeps the native footer installation action available after dismissing the automatic popup", async () => {
  const prompt = offer();
  fireEvent.click(screen.getByText("Dismiss"));
  expect(state().open).toBe(false);
  await act(async () => { fireEvent.click(screen.getByText("Install App")); });
  expect(prompt).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem(INSTALL_ACCEPTED_KEY)).toBe("true");
});

it("retains the native event during the automatic dismissal cooldown", async () => {
  cleanup();
  localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now()));
  render(<AppInstallProvider><Controls /></AppInstallProvider>);
  const prompt = offer();
  expect(state().open).toBe(false);
  await act(async () => { fireEvent.click(screen.getByText("Install App")); });
  expect(prompt).toHaveBeenCalledTimes(1);
});

it("automatically invites a first-time visitor even without a native eligibility event", () => {
  expect(state()).toEqual({ open: true, manual: false, installed: false });
});

it("does not automatically invite a previously installed visitor on reload", () => {
  cleanup();
  localStorage.setItem(INSTALL_ACCEPTED_KEY, "true");
  render(<AppInstallProvider><Controls /></AppInstallProvider>);
  expect(state().open).toBe(false);
});

it("never automatically invites visitors launching in standalone app mode", () => {
  cleanup();
  Object.defineProperty(navigator, "standalone", { value: true, configurable: true });
  try {
    render(<AppInstallProvider><Controls /></AppInstallProvider>);
    expect(state()).toEqual({ open: false, manual: false, installed: true });
  } finally {
    Object.defineProperty(navigator, "standalone", { value: false, configurable: true });
  }
});

it("shows manual installation instructions when no native prompt exists", async () => {
  await act(async () => { fireEvent.click(screen.getByText("Install App")); });
  expect(state()).toEqual({ open: true, manual: true, installed: false });
});

it("does not trigger an installation prompt after the browser reports installation", async () => {
  const prompt = offer();
  act(() => { window.dispatchEvent(new Event("appinstalled")); });
  expect(state().open).toBe(false);
  await act(async () => { fireEvent.click(screen.getByText("Install App")); });
  expect(prompt).not.toHaveBeenCalled();
  expect(state().installed).toBe(true);
});

it("shows manual instructions when the native prompt fails", async () => {
  const prompt = offer();
  prompt.mockRejectedValueOnce(new Error("Unavailable"));
  await act(async () => { fireEvent.click(screen.getByText("Install App")); });
  expect(state().manual).toBe(true);
  expect(state().open).toBe(true);
});