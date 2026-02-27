import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import worker from '../src/index';

describe('Web Push Proxy worker', () => {
	beforeEach(() => {
		// Mock global fetch to intercept outbound requests to Google FCM
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('blocks robots.txt and does not forward to FCM', async () => {
		const request = new Request('http://example.com/robots.txt');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		expect(await response.text()).toContain('User-agent: *');
		// Ensure no outbound request was made
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('returns 404 for invalid paths or methods', async () => {
		// Test GET on root
		const res1 = await worker.fetch(new Request('https://example.com/'), env, createExecutionContext());
		expect(res1.status).toBe(404);

		// Test GET on valid path
		const res2 = await worker.fetch(new Request('https://example.com/fcm/send', { method: 'GET' }), env, createExecutionContext());
		expect(res2.status).toBe(404);

		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('forwards valid Web Push requests (POST to /fcm/*) and adds CORS', async () => {
		const mockResponse = new Response('FCM Response OK', {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
		vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse);

		const request = new Request('https://example.com/fcm/abc/123', {
			method: 'POST',
			headers: { 'Authorization': 'key=secret', 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: 'hi' }),
		});

		const response = await worker.fetch(request, env, createExecutionContext());

		// 1. Check outbound request details
		expect(globalThis.fetch).toHaveBeenCalled();
		const capturedRequest = vi.mocked(globalThis.fetch).mock.calls[0][0] as Request;
		expect(capturedRequest.url).toBe('https://fcm.googleapis.com/fcm/abc/123');
		expect(capturedRequest.method).toBe('POST');
		expect(capturedRequest.headers.get('Authorization')).toBe('key=secret');

		// 2. Check response and CORS
		expect(response.status).toBe(200);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
		expect(await response.text()).toBe('FCM Response OK');
	});

	it('handles proxy errors (502) when outbound fetch fails', async () => {
		vi.mocked(globalThis.fetch).mockRejectedValue(new Error('FCM unreachable'));

		const request = new Request('https://example.com/wp/v1/send', { method: 'POST' });
		const response = await worker.fetch(request, env, createExecutionContext());

		expect(response.status).toBe(502);
		const body = await response.text();
		expect(body).toContain('Proxy error: FCM unreachable');
	});

	/**
	 * 集成测试风格 (模拟真实 HTTP 请求)
	 * 
	 * SELF 是什么？ 它是 Cloudflare 测试插件提供的一个“虚拟客户端”。
	 * 
	 * 它是怎么运行的？ 当你调用 SELF.fetch 时，测试框架实际上在后台启动了一个极简的 Worker 服务器，
	 * 把这个请求发给这个服务器，然后服务器路由到你的 src/index.ts。
	 * 
	 * 为什么要这么做？ 这样可以测试那些只有在真实网络环境下才会触发的行为，
	 * 比如全局变量的处理、复杂的 Header 传递等。
	 */
	it('works correctly in integration style (SELF.fetch)', async () => {
		// Ensure each call gets a fresh Response to avoid body usage conflicts
		vi.mocked(globalThis.fetch).mockImplementation(async () => {
			return new Response('Success', { status: 201 });
		});

		const response = await SELF.fetch('https://example.com/fcm/send', {
			method: 'POST',
			body: 'test'
		});

		expect(response.status).toBe(201);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
		expect(await response.text()).toBe('Success');
	});
});
