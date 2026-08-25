import { createFileRoute } from "@tanstack/react-router";
import { fetchCmsRowBySeq, rowToVuln } from "@/lib/cms";

const ALLOWED_LAB_HOST = "github.com";

export const Route = createFileRoute("/vulnerabilities/$vulnId/download")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = Number(params.vulnId);
        if (!Number.isInteger(id) || id < 1) {
          return new Response("Not Found", { status: 404 });
        }

        const row = await fetchCmsRowBySeq("vuln", id);
        if (!row || !row.published) {
          return new Response("Not Found", { status: 404 });
        }

        const vulnerability = rowToVuln(row);
        if (vulnerability.price && vulnerability.price > 0) {
          return new Response("Download unavailable for paid vulnerabilities", { status: 403 });
        }
        if (!vulnerability.downloadUrl) {
          return new Response("No verified file is available for this vulnerability", { status: 404 });
        }

        const source = new URL(vulnerability.downloadUrl);
        if (source.protocol !== "https:" || source.hostname !== ALLOWED_LAB_HOST) {
          return new Response("Unapproved download source", { status: 403 });
        }

        const upstream = await fetch(source, {
          headers: { "User-Agent": "Magrm-Security-Lab-Downloader/1.0" },
        });
        if (!upstream.ok || !upstream.body) {
          return new Response("Verified lab download is temporarily unavailable", { status: 502 });
        }

        const filename = (vulnerability.downloadName || `${vulnerability.cve}.bin`).replace(/[^a-zA-Z0-9._-]/g, "-");
        return new Response(upstream.body, {
          headers: {
            "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "public, max-age=86400",
            "X-Content-Source": "Official open-source security lab",
          },
        });
      },
    },
  },
});
