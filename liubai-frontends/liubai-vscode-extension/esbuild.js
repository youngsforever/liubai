const polyfill = require("esbuild-plugin-polyfill-node");
const esbuild = require("esbuild");
const dotenv = require('dotenv');
const path = require('path');
const { version } = require("./package.json");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

function handleEnv() {
	// load .env
	const cfg1 = dotenv.config().parsed || {}

	// load .env.local
  const cfg2 = dotenv.config({ 
		path: path.resolve(__dirname, '.env.local')
	}).parsed || {}

	// load .env.production or .env.development
	const proOrDev = production ? "production" : "development"
	const envFile3 = `.env.${proOrDev}`
	const cfg3 = dotenv.config({ 
		path: path.resolve(__dirname, envFile3),
	}).parsed || {}

	// load .env.development.local or .env.production.local
	const envFile4 = `.env.${proOrDev}.local`
	const cfg4 = dotenv.config({ 
		path: path.resolve(__dirname, envFile4),
	}).parsed || {}
	
	// merge environment variables
	const mergedEnvConfig = { ...cfg1, ...cfg2, ...cfg3, ...cfg4 }

	// handle LIU_ENV
	const _liuEnv = {
		"LIU_ENV.EXT_VERSION": JSON.stringify(version),
		"LIU_ENV.MODE": JSON.stringify(proOrDev),
	}
	for(const key in mergedEnvConfig) {
		_liuEnv[`LIU_ENV.${key}`] = JSON.stringify(mergedEnvConfig[key])
	}
	return _liuEnv
}

const liuEnv = handleEnv()

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

async function buildNodeExtension() {
	const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/node/extension.js',
    external: ['vscode'],
    logLevel: 'silent',
		define: {
			...liuEnv,
		},
    plugins: [esbuildProblemMatcherPlugin],
  })
  if (watch) {
    await ctx.watch()
  } else {
    await ctx.rebuild()
    await ctx.dispose()
  }
}

async function buildWebExtension() {
	const ctx = await esbuild.context({
		entryPoints: ['src/extension.ts'], // 通用入口文件
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
		platform: 'browser',
		outfile: "dist/web/extension.js",
		external: ['vscode'],
		logLevel: 'silent',
		define: {
			...liuEnv,
      global: 'globalThis',
    },
		plugins: [
			polyfill.polyfillNode({
				globals: {
					"process": false,
				},
				polyfills: {
					"crypto": true,
				}
			}),
			esbuildProblemMatcherPlugin,
		]
	})
	if (watch) {
    await ctx.watch()
  } else {
    await ctx.rebuild()
    await ctx.dispose()
  }
}

async function main() {
	console.log('Building Node extension...')
	await buildNodeExtension()

	console.log('Building Web extension...')
	await buildWebExtension()
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
