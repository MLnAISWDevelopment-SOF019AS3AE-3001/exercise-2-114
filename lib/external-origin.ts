function firstHeader(value: string | null): string {
  return value?.split(",")[0]?.trim() ?? "";
}

function hostnameOf(host: string): string {
  if (host.startsWith("[")) {
    const end = host.indexOf("]");
    return end === -1 ? host : host.slice(1, end);
  }
  return host.replace(/:\d+$/, "");
}

// The standalone server listens on 0.0.0.0. Next then builds request.url from
// that bind address, so a redirect would send the browser to 0.0.0.0:3000.
// The OpenShift router sends the public host in x-forwarded-host.
export function externalOrigin(headers: Headers, requestUrl: string): string {
  const forwardedHost = firstHeader(headers.get("x-forwarded-host"));
  const host = forwardedHost || firstHeader(headers.get("host"));
  if (host && hostnameOf(host) !== "0.0.0.0") {
    const forwardedProto = firstHeader(headers.get("x-forwarded-proto"));
    const proto =
      forwardedProto || new URL(requestUrl).protocol.replace(":", "") || "https";
    return `${proto}://${host}`;
  }
  const url = new URL(requestUrl);
  if (url.hostname !== "0.0.0.0") return url.origin;
  return "";
}
