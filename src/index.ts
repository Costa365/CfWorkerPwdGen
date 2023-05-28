/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

export default {

	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {

		function generateChars(charset: string, length: number): string {
			let retVal = ""
			for (var i = 0, n = charset.length; i < length; ++i) {
				retVal += charset.charAt(Math.floor(Math.random() * n))
			}
			return retVal
		}

		function generatePassword(upper: number, lower: number, num: number, special: number): string {
			let password = ""
			const alpha = "abcdefghijklmnopqrstuvwxyz"
			password += generateChars(alpha.toUpperCase(), upper)
			password += generateChars(alpha.toLowerCase(), lower)
			password += generateChars("0123456789",num)
			password += generateChars("!@#$%^&*()_+-",special)
			let shuffled = password.split('').sort(function(){return 0.5-Math.random()}).join('')
			return shuffled
		}

		const { searchParams } = new URL(request.url)

		const upper = parseInt(searchParams.get('upper')!)
		const lower = parseInt(searchParams.get('lower')!)
		const num = parseInt(searchParams.get('num')!)
		const special = parseInt(searchParams.get('special')!)

		const data = {
    	password: generatePassword(upper, lower, num, special),
			upper: upper,
			lower: lower,
			num: num,
			special: special
  	};
		const json = JSON.stringify(data, null, 2);
		
		return new Response(json, {
			headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
		});

	},
};
