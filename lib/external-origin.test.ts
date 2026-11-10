import { expect, test } from "bun:test";
import { externalOrigin } from "./external-origin";

test("a Rahti request uses the forwarded host", () => {
  const headers = new Headers({
    "x-forwarded-host": "exercise-2-web-mlnais3001.2.rahtiapp.fi",
    "x-forwarded-proto": "https",
    host: "0.0.0.0:3000",
  });
  expect(
    externalOrigin(headers, "https://0.0.0.0:3000/api/login"),
  ).toBe("https://exercise-2-web-mlnais3001.2.rahtiapp.fi");
});

test("the bind address is not used as the public origin", () => {
  const headers = new Headers({ host: "0.0.0.0:3000" });
  expect(externalOrigin(headers, "https://0.0.0.0:3000/api/login")).toBe("");
});

test("a local request keeps its own host", () => {
  const headers = new Headers({ host: "localhost:3000" });
  expect(externalOrigin(headers, "http://localhost:3000/api/login")).toBe(
    "http://localhost:3000",
  );
});
