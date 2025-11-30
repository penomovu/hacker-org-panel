import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

export async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail
  };
}

export async function sendContractNotification(contract: {
  id: string;
  target: string;
  type: string;
  details: string;
  bounty: string | null;
}) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const typeLabels: Record<string, string> = {
      target_infiltration: "TARGET_INFILTRATION",
      data_extraction: "DATA_EXTRACTION",
      account_takeover: "ACCOUNT_TAKEOVER",
      network_breach: "NETWORK_BREACH",
    };

    const result = await client.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ronio8641@gmail.com',
      subject: `[SHADOW_NETWORK] New Contract: ${contract.id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #fff; padding: 30px; max-width: 600px;">
          <div style="border: 1px solid #333; padding: 20px;">
            <h1 style="color: #ef4444; margin: 0 0 20px 0; font-size: 18px; letter-spacing: 2px;">
              ⚠️ NEW CONTRACT TRANSMISSION
            </h1>
            
            <div style="border-top: 1px solid #333; padding-top: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 12px;">CONTRACT_ID:</td>
                  <td style="padding: 10px 0; color: #fff;">${contract.id}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 12px;">TARGET:</td>
                  <td style="padding: 10px 0; color: #ef4444;">${contract.target}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 12px;">OPERATION_TYPE:</td>
                  <td style="padding: 10px 0; color: #22c55e;">${typeLabels[contract.type] || contract.type}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 12px;">BOUNTY:</td>
                  <td style="padding: 10px 0; color: #eab308;">${contract.bounty || "TBD"}</td>
                </tr>
              </table>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #111; border: 1px solid #222;">
              <div style="color: #888; font-size: 11px; margin-bottom: 8px;">MISSION_BRIEF:</div>
              <div style="color: #ccc; font-size: 13px; line-height: 1.6;">${contract.details}</div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #14532d; border: 1px solid #22c55e;">
              <p style="margin: 0; color: #22c55e; font-size: 12px;">
                ACTION REQUIRED: Review this contract in the Operator Console.
              </p>
            </div>
          </div>
          
          <div style="margin-top: 15px; text-align: center; color: #444; font-size: 10px;">
            SHADOW_NETWORK // ENCRYPTED_TRANSMISSION
          </div>
        </div>
      `,
    });

    console.log('Email notification sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
}
