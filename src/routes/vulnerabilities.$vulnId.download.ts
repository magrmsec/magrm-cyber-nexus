import { createFileRoute } from "@tanstack/react-router";
import { fetchCmsRowBySeq, rowToVuln } from "@/lib/cms";

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
        const payload = {
          cve: vulnerability.cve,
          name: vulnerability.name,
          severity: vulnerability.severity,
          cvss: vulnerability.cvss,
          date: vulnerability.date,
          type: vulnerability.type,
          affected: vulnerability.affected,
          description: vulnerability.description,
          mitigation: vulnerability.mitigation,
          usage: "بيانات دفاعية للتوعية والحماية ضمن نطاق مصرح به فقط",
        };

        return new Response(JSON.stringify(payload, null, 2), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Content-Disposition": `attachment; filename="${vulnerability.cve}.json"`,
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
