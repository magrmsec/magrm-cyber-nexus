import { createFileRoute } from "@tanstack/react-router";
import { fetchCmsRowBySeq, rowToVuln } from "@/lib/cms";

const DVWA_SOURCE = "https://github.com/digininja/DVWA/archive/refs/heads/master.zip";

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

        const upstream = await fetch(DVWA_SOURCE, {
          headers: { "User-Agent": "Magrm-Security-Lab-Downloader/1.0" },
        });
        if (!upstream.ok || !upstream.body) {
          return new Response("Security lab download is temporarily unavailable", { status: 502 });
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="Magrm-DVWA-Lab-${vulnerability.cve}.zip"`,
            "Cache-Control": "public, max-age=86400",
            "X-Content-Source": "DVWA official repository",
          },
        });
      },
    },
  },
});
