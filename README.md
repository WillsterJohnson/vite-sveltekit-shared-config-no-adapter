# Vite+SvelteKit: Shared Config no Adapter

This repo demonstrates an issue wherein SvelteKit adapters are not executed when Vite's config is imported from a shared config package within a monorepo.

## What Do I Do Here?

[Here's a one-liner for you](#one-liner)

This repo uses pnpm. Please ensure you have it installed on your system (I'm sure you do, it's the best).

You should use either Node v16 or Node v18. Please ensure that you are using the correct version via `node -v`. Node 17 may not work entirely correctly (reason: adapter-vercel demands v16 or v18).

Before you begin, `cd` to the root of this repo and run `pnpm -r install` to install dependencies.

By default, this repo is in a state where everything works correctly. See the [vite config file](./apps/appname/vite.config.ts) to see what changes.

To toggle the issue, run `pnpm run toggle`.

To attempt to build the app, run `pnpm run demo`.

### One-Liner

Never blindly copy-paste commands into your terminal. Read the following script to be sure you're happy to run it.

IMPORTANT: run `node -v` first, make sure you're using v16 or v18!

```bash
# cd to somewhere safe. This command will create a subdirectory, clone this repo, enter it, and run some stuff.
git clone git@github.com:willsterjohnson/vite-sveltekit-shared-config-no-adapter.git ./vite-sveltekit-shared-config-no-adapter && \
cd ./vite-sveltekit-shared-config-no-adapter && \
# !IMPORTANT! rm -rf used, be certain you're in the right location for this.
rm -rf ./outputs && \
mkdir ./outputs && \
pnpm -r install --frozen-lockfile && \
# copy from next line if re-running in VSCode
pnpm run demo > ./outputs/local-config__build-output.log && \
# !IMPORTANT! rm -rf used, be certain you're in the right location for this.
rm -rf ./apps/appname/.vercel ./apps/appname/.svelte-kit && \
cp ./apps/appname/vite.config.ts ./outputs/local-config__vite.config.ts && \
# toggle to broken build - using shared config package
pnpm run toggle && \
pnpm run demo > ./outputs/shared-config__build-output.log && \
# !IMPORTANT! rm -rf used, be certain you're in the right location for this.
rm -rf ./apps/appname/.vercel ./apps/appname/.svelte-kit && \
cp ./apps/appname/vite.config.ts ./outputs/shared-config__vite.config.ts && \
# toggle to working build - using local config (in case you wish to re-run this script)
pnpm run toggle && \
# STOP! do you have VSCode installed?
code --diff ./outputs/local-config__build-output.log ./outputs/shared-config__build-output.log && \
code --diff ./outputs/local-config__vite.config.ts ./outputs/shared-config__vite.config.ts && \
code . ./README.md
```

> "one-liner"
That was 16 lines, 24 if you count comments.

## What's the Issue?

The first time the app is built (see files in `outputs` with `local-config__` prefix), the build command ends by printing this message:

```txt
Run npm run preview to preview your production build locally.

> Using @sveltejs/adapter-vercel
  ✔ done
✓ built in 3.00s
```

This confirms that the adapter has been used correctly.

Now look at the next time the app is built (see files in `outputs` with `shared-config__` prefix). The build command does not end with this message, and no `.vercel` directory is created.

## Why This Sucks

When working in a monorepo, particularly one which has several apps and packages which use the same tool in the same way (or with a few small changes), it's hugely useful to share configurations across those projects via a shared config package.

Unfortunately, it appears that this is not currently achieveable for SvelteKit, as when the Vite config originates from outside of the project (ie, originates from a shared config package), SvelteKit does not correctly execute it's adapters. As such, the app cannot be built for production without repeating Vite's configuration in every deployable app.
