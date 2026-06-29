export interface Env {
    RESEND_API_KEY: string;
    RESEND_AUDIENCE_ID: string;
    API_KEY?: string; // Secret key for inviting people
    NOTIFICATION_EMAIL?: string;
    INVESTOR_WHITELIST: KVNamespace;
    COSIGN_SESSIONS: KVNamespace;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
};

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders,
            });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        // ── Interviewer (KnowDrive) OAuth native redirect ─────────────────────────
        // The KnowDrive AS only allows https:// redirect_uris, so it sends the OAuth
        // code here. We forward it to the app's custom scheme; the in-app auth
        // session intercepts that URL to finish login.
        const APP_SCHEME = 'interviewer://oauth'; // must match app.json `scheme` + path

        if (request.method === 'GET' && path === '/oauth/native-callback') {
            const qs = url.search || '';
            const target = APP_SCHEME + qs;
            const params = new URLSearchParams(qs);
            const err = params.get('error');
            const safe = (s: unknown): string =>
                String(s || '').replace(/[&<>"']/g, (c: string) =>
                    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c)
                );
            const html = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Returning you to Interviewer\u2026</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
background:#FBFAFF;color:#1C1C2B;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:24px}
.c{max-width:360px;width:100%;text-align:center;background:#fff;border:1px solid #ECE9F7;border-radius:22px;
padding:32px 26px;box-shadow:0 14px 44px rgba(60,40,120,.09)}a.b{display:inline-block;text-decoration:none;
font-weight:700;color:#fff;background:#6C5CE7;padding:13px 22px;border-radius:13px}h1{font-size:19px;margin:0 0 8px}
p{font-size:14px;color:#5A5A6E;margin:0 0 20px}.e{color:#C2410C}</style></head>
<body><div class="c">
${err
    ? `<h1>Sign-in was cancelled</h1><p class="e">${safe(params.get('error_description') || err)}</p>`
    : `<h1>Returning you to Interviewer\u2026</h1><p>If the app doesn't open automatically, tap below.</p>`}
<a class="b" href="${safe(target)}">Open Interviewer</a></div>
<script>var t=${JSON.stringify(target)};${err ? '' : 'setTimeout(function(){location.replace(t)},60);'}</script>
</body></html>`;
            return new Response(html, {
                headers: {
                    'content-type': 'text/html; charset=utf-8',
                    'cache-control': 'no-store',
                },
            });
        }

        // ── App-Link association files ─────────────────────────────────────────────
        // Optional: enables direct-open Universal Links (iOS) / App Links (Android).
        // Required: TEAMID must be the 10-char Apple Team ID from developer.apple.com.
        if (request.method === 'GET' && path === '/.well-known/apple-app-site-association') {
            return Response.json({
                applinks: {
                    apps: [],
                    details: [{
                        appID: 'TEAMID.ai.knowdrive.interviewer', // ← replace TEAMID
                        paths: ['/oauth/*', '/oauth/native-callback'],
                    }],
                },
            });
        }

        if (request.method === 'GET' && path === '/.well-known/assetlinks.json') {
            return Response.json([{
                relation: ['delegate_permission/common.handle_all_urls'],
                target: {
                    namespace: 'android_app',
                    package_name: 'ai.knowdrive.interviewer',
                    sha256_cert_fingerprints: [
                        'REPLACE_WITH_ANDROID_APP_SIGNING_SHA256', // ← from Play Console
                    ],
                },
            }]);
        }
        // ──────────────────────────────────────────────────────────────────────────

        // --- Investor invitation endpoint (Secure) ---
        if (path === '/v1/invest/invite') {
            if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
            
            const apiKey = request.headers.get('x-api-key');
            if (!env.API_KEY || apiKey !== env.API_KEY) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            }

            try {
                const { email } = await request.json() as { email: string };
                if (!email) return new Response(JSON.stringify({ error: 'Email required' }), { status: 400, headers: corsHeaders });
                
                await env.INVESTOR_WHITELIST.put(email.toLowerCase().trim(), 'true');
                return new Response(JSON.stringify({ success: true, message: `Invited ${email}` }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            } catch (err) {
                return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: corsHeaders });
            }
        }

        // --- CoSign Endpoints ---
        if (path === '/v1/cosign/init' && request.method === 'POST') {
            try {
                const { pdfBase64, signerEmails, creatorEmail, fileName } = await request.json() as any;
                if (!pdfBase64 || !signerEmails || !creatorEmail) {
                    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: corsHeaders });
                }
                const sessionId = crypto.randomUUID();
                const sessionData = {
                    id: sessionId,
                    pdfBase64,
                    totalSignatories: signerEmails.length,
                    signerEmails,
                    creatorEmail,
                    fileName: fileName || 'document.pdf',
                    signatures: [],
                    logs: [{ message: 'Session initialized', type: 'info', timestamp: new Date().toISOString() }],
                    createdAt: new Date().toISOString(),
                    status: 'active'
                };

                // Send invitations
                if (env.RESEND_API_KEY) {
                    for (const email of signerEmails) {
                        try {
                            const resendResponse = await fetch('https://api.resend.com/emails', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    from: 'CoSign <onboarding@recoursellm.com>',
                                    to: [email],
                                    subject: `Invitation to Sign: ${sessionData.fileName}`,
                                    html: `
                                        <div style="font-family: sans-serif; padding: 20px; color: #fff; background: #000; border-radius: 12px;">
                                            <h1 style="color: #D6A04B;">Signature Requested</h1>
                                            <p>You have been invited to sign <strong>${sessionData.fileName}</strong>.</p>
                                            <p><a href="https://recoursellm.com/cosign/${sessionId}" style="color: #D6A04B; text-decoration: none; font-weight: bold;">Click here to sign the document</a></p>
                                        </div>
                                    `
                                })
                            });
                            
                            if (resendResponse.ok) {
                                sessionData.logs.push({ message: `Invitation sent to ${email}`, type: 'success', timestamp: new Date().toISOString() });
                            } else {
                                const errorText = await resendResponse.text();
                                sessionData.logs.push({ message: `Resend Error for ${email}: ${errorText}`, type: 'error', timestamp: new Date().toISOString() });
                            }
                        } catch (e: any) {
                            sessionData.logs.push({ message: `Network Error for ${email}: ${e.message}`, type: 'error', timestamp: new Date().toISOString() });
                        }
                    }
                }

                await env.COSIGN_SESSIONS.put(sessionId, JSON.stringify(sessionData));
                return new Response(JSON.stringify({ sessionId }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            } catch (err) {
                return new Response(JSON.stringify({ error: 'Initialization failed' }), { status: 500, headers: corsHeaders });
            }
        }

        if (path.startsWith('/v1/cosign/') && !path.endsWith('/sign') && request.method === 'GET') {
            const sessionId = path.split('/')[3];
            const data = await env.COSIGN_SESSIONS.get(sessionId);
            if (!data) return new Response(JSON.stringify({ error: 'Session not found' }), { status: 404, headers: corsHeaders });
            
            // Don't return the full PDF for every status check if it's large, but for now we might need it.
            // Let's filter out the PDF if it's just a status check? No, the signer needs it.
            return new Response(data, { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        if (path.startsWith('/v1/cosign/') && path.endsWith('/sign') && request.method === 'POST') {
            const sessionId = path.split('/')[3];
            try {
                const { signatureBase64, signerName, placement } = await request.json() as any;
                const data = await env.COSIGN_SESSIONS.get(sessionId);
                if (!data) return new Response(JSON.stringify({ error: 'Session not found' }), { status: 404, headers: corsHeaders });
                
                const session = JSON.parse(data);
                if (session.status === 'completed') {
                    return new Response(JSON.stringify({ error: 'Already completed' }), { status: 400, headers: corsHeaders });
                }

                session.signatures.push({
                    signature: signatureBase64,
                    name: signerName,
                    placement: placement, // { pageIndex: number, x: number, y: number, includeDate: boolean }
                    timestamp: new Date().toISOString()
                });

                session.logs.push({ message: `Signature received from ${signerName}`, type: 'success', timestamp: new Date().toISOString() });

                if (session.signatures.length >= session.totalSignatories) {
                    session.status = 'completed';
                    session.logs.push({ message: `All ${session.totalSignatories} signatures collected. Document ready.`, type: 'success', timestamp: new Date().toISOString() });
                    
                    // Notify creator
                    if (env.RESEND_API_KEY && session.creatorEmail) {
                        try {
                            const completionRes = await fetch('https://api.resend.com/emails', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    from: 'CoSign <no-reply@recoursellm.com>',
                                    to: [session.creatorEmail],
                                    subject: `Document Fully Signed: ${session.fileName}`,
                                    html: `
                                        <div style="font-family: sans-serif; padding: 20px; color: #fff; background: #000; border-radius: 12px;">
                                            <h1 style="color: #4ade80;">Document Completed</h1>
                                            <p>All signatories have signed <strong>${session.fileName}</strong>.</p>
                                            <p><a href="https://recoursellm.com/cosign/${sessionId}" style="color: #4ade80; text-decoration: none; font-weight: bold;">Click here to download the final PDF</a></p>
                                        </div>
                                    `
                                })
                            });
                            if (completionRes.ok) {
                                session.logs.push({ message: `Completion notification sent to ${session.creatorEmail}`, type: 'success', timestamp: new Date().toISOString() });
                            } else {
                                const errorText = await completionRes.text();
                                session.logs.push({ message: `Completion Email Error: ${errorText}`, type: 'error', timestamp: new Date().toISOString() });
                            }
                        } catch (e: any) {
                            session.logs.push({ message: `Completion Email Network Error: ${e.message}`, type: 'error', timestamp: new Date().toISOString() });
                        }
                    }
                }

                await env.COSIGN_SESSIONS.put(sessionId, JSON.stringify(session));
                return new Response(JSON.stringify({ success: true, status: session.status }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            } catch (err) {
                return new Response(JSON.stringify({ error: 'Signing failed' }), { status: 500, headers: corsHeaders });
            }
        }

        // --- Investor verification endpoint (Public) ---
        if (path === '/v1/invest/verify') {
            if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
            
            try {
                const { email } = await request.json() as { email: string };
                if (!email) return new Response(JSON.stringify({ error: 'Email required' }), { status: 400, headers: corsHeaders });
                
                const allowed = await env.INVESTOR_WHITELIST.get(email.toLowerCase().trim());
                return new Response(JSON.stringify({ allowed: !!allowed }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            } catch (err) {
                return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: corsHeaders });
            }
        }

        // --- Existing Waitlist/Blog endpoints ---
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        try {
            const body: any = await request.json();
            const { name, email, useCase, formMode } = body;

            if (!email) {
                return new Response(JSON.stringify({ error: 'Email is required' }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            // 1. Add to Resend Audience
            if (env.RESEND_API_KEY && env.RESEND_AUDIENCE_ID) {
                const audienceRes = await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        first_name: name ? name.split(' ')[0] : '',
                        last_name: name && name.includes(' ') ? name.split(' ').slice(1).join(' ') : '',
                        unsubscribed: false
                    })
                });

                if (!audienceRes.ok) {
                    console.error('Failed to add to audience:', await audienceRes.text());
                }
            }

            // 2. Send Auto-Reply to the User
            const nameFirst = name ? name.split(' ')[0] : 'there';
            const isBlog = formMode === 'blog_subscribe';
            
            let subject = `Welcome to the Environment, ${nameFirst}.`;
            let headline = "You're in.";
            let message = `Thanks for joining the <span class="accent">RecourseLLM Beta Waitlist</span>. You've taken the first step toward escaping the context window.`;
            let subMessage = "We're currently provisioning environments for our next cohort, and we'll notify you as soon as your access is ready.";
            
            if (isBlog) {
                subject = "Welcome to the RecourseLLM Engineering Blog";
                headline = "Intelligence, Delivered.";
                message = `Thanks for subscribing to the <span class="accent">RecourseLLM Engineering Blog</span>. You'll now receive our latest architecture deep-dives and technical updates.`;
                subMessage = "We believe in scaling intelligence through dynamic environments, not just bigger context windows. We're excited to share our progress with you.";
            }

            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #000000; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .logo { height: 40px; margin-bottom: 20px; }
                    .content { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 24px; padding: 40px; text-align: center; }
                    h1 { font-size: 32px; font-weight: 700; margin-bottom: 20px; color: #ffffff; }
                    p { font-size: 16px; color: #a1a1a1; margin-bottom: 30px; }
                    .accent { color: #D6A04B; font-weight: 600; }
                    .button { display: inline-block; background-color: #D6A04B; color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(214, 160, 75, 0.3); }
                    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666666; }
                    .divider { border: 0; border-top: 1px solid #1a1a1a; margin: 30px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://invest.recoursellm.com/recourse_logo_white.png" alt="RecourseLLM" class="logo">
                    </div>
                    <div class="content">
                        <h1>${headline}</h1>
                        <p>Hi ${nameFirst},</p>
                        <p>${message}</p>
                        <p>${subMessage}</p>
                    </div>
                    <div class="footer">
                        <p>Joel, Pierre, and the RecourseLLM Team</p>
                        <p><a href="https://recoursellm.com" style="color: #666666; text-decoration: none;">recoursellm.com</a> | Intelligence, Optimized at the Source.</p>
                    </div>
                </div>
            </body>
            </html>
            `;

            if (env.RESEND_API_KEY) {
                const autoReplyRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'RecourseLLM <hello@recoursellm.com>',
                        to: [email],
                        subject: subject,
                        html: emailHtml
                    })
                });

                if (!autoReplyRes.ok) {
                    console.error('Failed to send auto-reply:', await autoReplyRes.text());
                }
            }

            // 3. Optional: Send Notification Email via Resend
            if (env.RESEND_API_KEY && env.NOTIFICATION_EMAIL) {
                const emailRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'RecourseLLM Notifications <notifications@recoursellm.com>',
                        to: [env.NOTIFICATION_EMAIL],
                        subject: `New RecourseLLM ${formMode === 'waitlist' ? 'Waitlist Signup' : 'Demo Request'}`,
                        html: `
							<h2>New Submission Details</h2>
							<p><strong>Name:</strong> ${name || 'N/A'}</p>
							<p><strong>Email:</strong> ${email}</p>
							<p><strong>Mode:</strong> ${formMode || 'N/A'}</p>
							<p><strong>Use Case:</strong> ${useCase || 'N/A'}</p>
						`
                    })
                });

                if (!emailRes.ok) {
                    console.error('Failed to send notification email:', await emailRes.text());
                }
            }

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });

        } catch (error: any) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
    },
};
