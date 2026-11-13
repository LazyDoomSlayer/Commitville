# Public and private data boundary

Commitville is developed in a public personal repository. The generic engine and fictional demo content are public; organization-specific content is not.

## Never commit

- Real employee names, photographs, or recognizable likenesses
- Work schedules, attendance, performance, or productivity information
- Company, client, vendor, or internal project names without explicit permission
- Internal domains, IP addresses, network diagrams, or infrastructure details
- API keys, tokens, cookies, credentials, or private configuration
- Licensed artwork, fonts, or audio that cannot be redistributed

## Intended local locations

The repository ignores these paths:

```text
private/
public/config/team.json
public/assets/private/
```

They provide an explicit place for local experiments, but ignored files are not a security boundary. Before publishing or opening a PR, inspect the diff and the built `dist/` output for private information.

## Public fixtures

Public examples use fictional names, roles, dialogue, organizations, and schedules. Do not pseudonymize real confidential events and treat them as fictional if the underlying details remain recognizable.

## Future private deployments

If private configuration becomes a supported product feature, it must be designed so that:

- The public build works without it.
- Secrets are not embedded in browser bundles.
- Missing configuration fails safely.
- The data source and its owner are documented.
- Any network communication is isolated in a service.
