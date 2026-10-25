# Taha Infrastructure Studio — Template-Based Design System

## Source of the visual direction

The frontend is rebuilt from the actual user-supplied **Cyber Monday landing page template**, whose editable Illustrator/EPS source files and JPEG preview are held locally in the user's Downloads directory.

This implementation does **not** place the whole reference screenshot behind the website. The layout, typography, borders, buttons, geometric elements and content are recreated as native React/HTML/CSS/SVG components.

The visible hero uses the user's own local portrait file (`TAHAGITHUB.png`), resized into `public/template/taha-portrait.webp` using ImageMagick without altering the subject. The original couple photo from the commercial template is not published. The coded shapes, typography and geometry follow the user-provided editable `.ai` / `.eps` and JPEG template reference.

Moving network paths and diagram accents are coded SVG/CSS animations representing conceptual topology; they are not live packet telemetry.

## Visual tokens

| Token | Usage |
|---|---|
| `#7736FF` | Main purple stage / outer background |
| `#102C43` | Navigation and structural midnight blue |
| `#263D57` | Hero background tone |
| `#03CEEF` | Cyan strokes and secondary actions |
| `#FA3468` | Small chevron accents from the reference |
| `Poppins` | Interface, nav, paragraphs and section headings |
| `Press Start 2P` | Hero title, logo signature and counters |
| `DM Mono` | Network/system metadata |

The typography is loaded through Google Fonts CSS; no local font files are shared.

## Application design

- Landing page: faithful visual structure of the reference, with the user-provided portrait, a fully coded hero, navigation and CTAs
- Expertise: table-like service rows and authentic technology logos from locally stored SVG files
- Projects: editable blueprint data summarized as simple technical network schematics, not decorative decorative art
- Private Studio and workbenches: coordinated navy/purple panels and light engineering topology canvas, preserving live functionality
- All claims of lab deployment or verification come from stored status/test records, not design decoration

## Platform stack

Next.js, React, TypeScript, Node.js, Express.js, React Flow, Monaco, PostgreSQL, GNS3 REST integration and RustFS S3-compatible object storage. No Three.js, React Three Fiber or GSAP visual dependency is required for this template-based direction.
