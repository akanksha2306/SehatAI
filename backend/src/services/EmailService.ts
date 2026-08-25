import config from '../lib/config.js';

export class EmailService {
  private readonly brevoApiKey: string;
  private readonly brevoSenderEmail: string;

  constructor() {
    this.brevoApiKey = config.BREVO_API_KEY;
    this.brevoSenderEmail = config.BREVO_SENDER_EMAIL;
  }

  async sendMagicLink(email: string, magicLink: string): Promise<void> {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.brevoApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'SehatAI',
            email: this.brevoSenderEmail,
          },
          to: [{ email }],
          subject: 'Your SehatAI sign-in link',
          htmlContent: this.getMagicLinkEmailTemplate(magicLink),
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as { messageId: string };
        console.log(`[magic-link] email sent to ${email} via Brevo (id: ${data.messageId})`);
      } else {
        const errorData = (await response.json()) as { message?: string };
        console.error(`[magic-link] Brevo API error for ${email}: ${response.status} ${errorData.message || ''}`);
      }
    } catch (error) {
      // Log the error server-side but don't throw
      // This ensures we don't leak email delivery status to the client
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[magic-link] failed to send email to ${email}: ${errorMessage}`);
    }
  }

  private getMagicLinkEmailTemplate(magicLink: string): string {
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .header {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
        color: #000;
      }
      .content {
        margin-bottom: 24px;
        font-size: 16px;
      }
      .link-section {
        margin: 24px 0;
        padding: 16px;
        background-color: #f5f5f5;
        border-radius: 4px;
      }
      .magic-link {
        display: inline-block;
        padding: 12px 24px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        margin: 12px 0;
      }
      .magic-link:hover {
        background-color: #0056b3;
      }
      .link-text {
        word-break: break-all;
        color: #666;
        font-size: 14px;
        margin-top: 12px;
      }
      .footer {
        font-size: 12px;
        color: #999;
        margin-top: 24px;
        border-top: 1px solid #ddd;
        padding-top: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Welcome to SehatAI</div>
      <div class="content">
        Click the link below to sign in to your account. This link expires in 15 minutes.
      </div>
      <div class="link-section">
        <a href="${magicLink}" class="magic-link">Sign In to SehatAI</a>
        <div class="link-text">Or copy and paste this link in your browser:</div>
        <div class="link-text">${magicLink}</div>
      </div>
      <div class="footer">
        <p>This link is valid for 15 minutes. If you did not request this email, you can safely ignore it.</p>
      </div>
    </div>
  </body>
</html>
    `.trim();
  }
}
