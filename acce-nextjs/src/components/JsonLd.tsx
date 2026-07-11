/**
 * Server-rendered JSON-LD structured data.
 *
 * Renders a plain <script type="application/ld+json"> that is emitted into the
 * server HTML, so crawlers see the structured data in the initial response
 * without executing JavaScript. (next/script defers injection to the client,
 * which leaves the markup out of the prerendered HTML — see the App Router
 * docs, which recommend a raw script tag for JSON-LD.)
 */
export default function JsonLd({ id, data }: { id?: string; data: unknown }) {
    // Escape "<" so no data value can break out of the <script> element
    // (e.g. a stray "</script>" in future content).
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
    return (
        <script
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
        />
    );
}
