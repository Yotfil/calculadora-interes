import { afterEach, describe, expect, it, vi } from "vitest";

import { track } from "../track";

describe("track (wrapper GA4, docs/06 §2)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("es no-op sin PUBLIC_GA4_ID: no llama a gtag ni lanza", () => {
    vi.stubEnv("PUBLIC_GA4_ID", "");
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    expect(() =>
      track("calcular", {
        tab: "b",
        con_impulso: false,
        con_proteccion: false,
      }),
    ).not.toThrow();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("con ID configurado envía el evento a gtag con sus parámetros", () => {
    vi.stubEnv("PUBLIC_GA4_ID", "G-TEST123");
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    track("calcular", { tab: "a", con_impulso: true, con_proteccion: false });

    expect(gtag).toHaveBeenCalledWith("event", "calcular", {
      tab: "a",
      con_impulso: true,
      con_proteccion: false,
    });
  });
});
