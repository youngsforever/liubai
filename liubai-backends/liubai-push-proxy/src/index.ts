/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `bun run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `bun run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `bun run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// We expect the request to be sent to this worker with the original path
		// Example: https://proxy-worker.subdomain.workers.dev/wp/v1/sub-id
		// We need to forward it to: https://fcm.googleapis.com/wp/v1/sub-id

		const targetHost = 'fcm.googleapis.com';
		const newUrl = new URL(url.pathname + url.search, `https://${targetHost}`);

		console.log(`[Proxy] Incoming request: ${request.method} ${url.pathname}`);
		console.log(`[Proxy] Forwarding to: ${newUrl.toString()}`);

		// Create a new request based on the original one
		const newRequest = new Request(newUrl, {
			method: request.method,
			headers: request.headers,
			body: request.body,
			redirect: 'manual',
		});

		try {
			const start = Date.now();
			const response = await fetch(newRequest);
			const duration = Date.now() - start;

			console.log(`[Proxy] Response from FCM: ${response.status} ${response.statusText} (${duration}ms)`);

			// Create a response with the same status and body
			// We need to clone headers to avoid immutable header errors
			const newResponse = new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: new Headers(response.headers),
			});

			// Add CORS if needed (though not strictly necessary for this backend use case)
			newResponse.headers.set('Access-Control-Allow-Origin', '*');

			return newResponse;
		} catch (err: any) {
			console.error(`[Proxy] Error: ${err.message || err}`);
			return new Response(`Proxy error: ${err.message || err}`, { status: 502 });
		}
	},
} satisfies ExportedHandler<Env>;
