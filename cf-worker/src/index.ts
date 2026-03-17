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

            // 2. Optional: Send Notification Email via Resend
            if (env.RESEND_API_KEY && env.NOTIFICATION_EMAIL) {
                const emailRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Acme <onboarding@resend.dev>', // You should change this to a verified domain like updates@recoursellm.com later
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
