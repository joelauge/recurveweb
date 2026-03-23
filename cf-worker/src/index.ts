export interface Env {
    RESEND_API_KEY: string;
    RESEND_AUDIENCE_ID: string;
    // Optional: Email to send notifications to
    NOTIFICATION_EMAIL?: string;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders,
            });
        }

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
            const isWaitlist = formMode === 'waitlist';
            
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
                        <h1>You're in.</h1>
                        <p>Hi ${nameFirst},</p>
                        <p>Thanks for joining the <span class="accent">RecourseLLM Beta Waitlist</span>.</p>
                        <p>You've taken the first step toward escaping the context window. We're currently provisioning environments for our next cohort, and we'll notify you as soon as your access is ready.</p>
                        <div class="divider"></div>
                        <p style="font-size: 14px;">In the meantime, we recommend exploring our architecture to see how we've reconceptualized the codebase as a dynamic environment.</p>
                        <a href="https://recoursellm.com/architecture" class="button">Read the Architecture</a>
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
                        subject: `Welcome to the Environment, ${nameFirst}.`,
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
