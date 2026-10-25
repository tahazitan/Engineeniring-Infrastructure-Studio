# Taha IT Solutions — Brand & SEO Guidelines

## Purpose and positioning

**Business identity:** Taha IT Solutions — independent, engineer-led remote IT services. This is professional branding; it does not assert legal incorporation, a workforce, a physical office or customer numbers.

**Audience:** businesses and professionals needing remote support, network connectivity, Windows/Linux server assistance, firewall/VPN guidance, monitoring and security-oriented infrastructure work. Target clients include Morocco, Francophone markets and international freelancers/projects using Fiverr or Upwork.

**Voice:** practical, understandable and client-focused. Promises describe scope and processes, not guaranteed remediation, production uptime or unverifiable achievements.

## Visual source

The business-facing pages retain the essential design direction of the owner's original purple Cyber Monday template: violet strip and accents, deep navy background, cyan controls, pixel headline typography and a rounded hero portrait. The old decorative / AI-looking marketing topology illustration was **removed**, along with its unused home components.

The hero and About pages use the owner's newly uploaded **green-polo portrait**, supplied locally as `taha-portrait.webp`. The file was confirmed against the Mac Downloads original by SHA-256 before downsampling and is not AI-generated or retouched.

- Violet `#7338FF`: primary frame/CTA
- Navy `#102E44`: main technical identity
- Cyan `#03CEEF`: signals and secondary links
- Poppins: body and commercial offer copy
- Press Start 2P: limited signature display lettering
- DM Mono: engineering labels and metadata

Vendor and platform logos are local assets under `public/tech/`; vendor trademarks belong to their owners. Topology designs stay in **Projects** and the private **Studio**, where they provide real technical context.

## Website information architecture

- **Home:** useful service proposition, direct CTA, six offers, four-step client process, actual photo and verified technologies.
- **Services:** per-service purpose, typical deliverables, supported tools and scope/authorization notes.
- **Projects:** reference infrastructure designs labelled not yet deployed/verified; link to private Studio only in local private mode.
- **About:** independent professional background, documented employment chronology and accurate education (including the unfinished EMSI year).
- **Contact:** service brief composer with copy-to-clipboard and direct Fiverr/LinkedIn links. No fake contact address or unsupported live form.

## SEO strategy

Unique route titles and descriptions target phrases such as `remote IT support`, `Cisco networking`, `Windows Server and Active Directory`, `VPN configuration`, `Linux VPS administration`, `monitoring`, and related French client terminology where appropriate.

Schema.org Person and ProfessionalService entries identify the engineer and the independent service brand, **not** a registered enterprise. No fabricated review ratings, team sizes or awards are included.

- In local/private mode, `robots` correctly prevents indexation.
- Public mode allows marketing pages but disallows private Studio and APIs.
- `NEXT_PUBLIC_SITE_URL` must be set to the **verified public deployment origin** before the sitemap lists canonical pages. Avoid indexing a local-only URL.
- Landing content is semantic React/HTML; navigation is accessible, image alt text is meaningful, and visual motion respects reduced-motion settings.
- Fiverr username and LinkedIn profile links are user-provided. An unverified Upwork profile URL is intentionally not invented.

Public hosting of the marketing frontend should be separate from the local, authenticated GNS3 development environment.
