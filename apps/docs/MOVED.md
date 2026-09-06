# Docs moved

The Hitechcloud documentation site has moved to the **hitechcloud-frontend** monorepo
(`apps/docs`), where it deploys to the `hitechcloud-docs-*` Cloudflare Workers as
part of that repo's `.github/workflows/deploy.yml` (push `develop` → staging,
`main` → production).

This copy under `hitechcloudOS/apps/docs` is **retired**. Its `deploy:*` scripts have
been disarmed (they exit 1) so nobody accidentally publishes stale content over
the worker that hitechcloud-frontend now owns. The source is kept here only as
history — do not deploy it, and make content changes in hitechcloud-frontend.
