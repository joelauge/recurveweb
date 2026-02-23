import https from 'https';
import fs from 'fs';

const url = 'https://raw.githubusercontent.com/vinta/awesome-python/master/README.md';

https.get(url, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        const lines = rawData.split('\n');
        const categories: Record<string, { name: string, desc: string }[]> = {
            "Cloud & Infrastructure Management": [
                { name: "boto3", desc: "The AWS SDK for Python. Essential for granular control over S3, EC2, DynamoDB." },
                { name: "azure-sdk-for-python", desc: "Microsoft Azure SDK for Python. Over 500 packages for enterprise cloud management." },
                { name: "python-terraform", desc: "Python wrapper for Terraform command line tool. Trigger infrastructure deployments natively." }
            ],
            "Business & Financial Automation": [
                { name: "stripe", desc: "Official Stripe Python library for programmatic customer and subscription management." },
                { name: "freshbooks-sdk", desc: "Accounting automation. Create invoices and fetch client data easily." },
                { name: "squareup", desc: "Official Square Python SDK for integrating payment and POS data." }
            ],
            "Productivity & Developer Operations (DevOps)": [
                { name: "PyGithub", desc: "Typed interactions with the GitHub API v3. Automate repository and PR management." },
                { name: "launchdarkly-server-sdk", desc: "Official LaunchDarkly SDK for real-time feature management and flags." },
                { name: "sentry-sdk", desc: "The new Python SDK for Sentry. Capture logs and error tracking manually during a REPL session." }
            ],
            "Specialized Tech Tools (Data & AI)": [
                { name: "openai", desc: "Official Python library for the OpenAI API. Critical infrastructure for AI agents." },
                { name: "anthropic", desc: "Official Python library for the Anthropic API (Claude)." },
                { name: "wandb", desc: "Weights & Biases Python library for tracking machine learning experiments." },
                { name: "prefect", desc: "Modern workflow orchestrator. Define complex data pipelines natively in Python." }
            ]
        };

        let currentCategory = '';
        let gathering = false;

        for (const line of lines) {
            if (line.startsWith('## ')) {
                const title = line.replace('## ', '').trim();
                // Exclude some meta sections
                if (!['Contributing', 'Sponsors', 'Credits', 'Awesome Python'].includes(title)) {
                    currentCategory = title;
                    if (!categories[currentCategory]) {
                        categories[currentCategory] = [];
                    }
                    gathering = true;
                } else {
                    gathering = false;
                }
            } else if (gathering && (line.trim().startsWith('- ['))) {
                const match = line.trim().match(/\- \[([^\]]+)\]\([^)]+\) - (.+)/);
                if (match) {
                    let name = match[1].trim();
                    let desc = match[2].trim();
                    if (name && desc) {
                        // Remove bold markdown and trailing periods
                        name = name.replace(/\*\*/g, '');
                        desc = desc.replace(/\.$/, '').replace(/`/, ''); // sanitize backticks
                        categories[currentCategory].push({ name, desc });
                    }
                }
            }
        }

        // Clean up empty categories or those with very few items to make it look dense
        for (const [key, val] of Object.entries(categories)) {
            // Keep the custom categories even if they are small, else filter < 5
            const isCustom = ["Cloud & Infrastructure Management", "Business & Financial Automation", "Productivity & Developer Operations (DevOps)", "Specialized Tech Tools (Data & AI)"].includes(key);
            if (!isCustom && val.length < 5) {
                delete categories[key];
            }
        }

        fs.writeFileSync('./src/assets/pythonLibraries.json', JSON.stringify(categories, null, 2));
        console.log('Successfully wrote pythonLibraries.json with ' + Object.keys(categories).length + ' categories.');
    });
}).on('error', (e) => {
    console.error(e);
});
