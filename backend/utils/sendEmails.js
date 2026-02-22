import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendVerificationEmail = async (email, name, code) => {
  if (!email || !email.includes("@")) {
    console.log("Invalid email passed:", email);
    throw new Error("Invalid email format");
  }

  const cleanEmail = email.trim().toLowerCase();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.to = [
    {
      email: cleanEmail,
      name: name || "User",
    },
  ];

  sendSmtpEmail.sender = {
    email: "yashpaithane2004@gmail.com", // MUST be verified in Brevo
    name: "Institute Management System",
  };

  sendSmtpEmail.subject = "Verify Your Email - Institute Management System";
  sendSmtpEmail.htmlContent  = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Email Verification</title>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>
    </head>
    <body style="margin:0; padding:0; background-color:#080c14; font-family:'Jost', sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080c14; padding:48px 16px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg, #0d1526 0%, #111827 100%); border-radius:14px 14px 0 0; padding:28px 44px; border-bottom:1px solid #1e2d47;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="vertical-align:middle; padding-right:12px;">
                              <div style="width:36px; height:36px; background:linear-gradient(135deg,#3b82f6,#1d4ed8); border-radius:8px; text-align:center; line-height:36px; font-size:18px;">🎓</div>
                            </td>
                            <td style="vertical-align:middle;">
                              <span style="font-family:'Cormorant Garamond', Georgia, serif; font-size:20px; color:#e8edf5; letter-spacing:0.3px; font-weight:600;">Institute Management System</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td align="right">
                        <span style="display:inline-block; border:1px solid #1e3a6e; color:#60a5fa; font-size:10px; font-weight:500; letter-spacing:2px; padding:5px 12px; border-radius:20px; text-transform:uppercase;">Verification</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="background:linear-gradient(170deg, #0d1526 0%, #0a1020 100%); padding:52px 44px 44px;">

                  <div style="width:48px; height:3px; background:linear-gradient(90deg,#3b82f6,#60a5fa); border-radius:2px; margin-bottom:36px;"></div>

                  <h1 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:30px; color:#e8edf5; margin:0 0 14px; font-weight:700; line-height:1.3;">
                    Verify your email address
                  </h1>

                  <p style="font-size:15px; color:#6b7fa3; line-height:1.8; margin:0 0 10px;">
                    Hi <span style="color:#93c5fd; font-weight:500;">${name}</span>,
                  </p>

                  <p style="font-size:15px; color:#6b7fa3; line-height:1.8; margin:0 0 36px;">
                    You're one step away from accessing the Institute Management System. Use the verification code below to confirm your email address and activate your account.
                  </p>

                  <!-- OTP Block -->
                  <div style="background:#0a0f1e; border:1px solid #1e2d47; border-radius:12px; padding:32px 24px; text-align:center; margin-bottom:36px;">
                    <p style="font-size:11px; color:#3b5280; letter-spacing:2.5px; text-transform:uppercase; margin:0 0 18px; font-weight:500;">Your Verification Code</p>

                    <div style="display:inline-block; letter-spacing:18px; font-family:'Cormorant Garamond', Georgia, serif; font-size:48px; font-weight:700; color:#ffffff; text-indent:18px;">
                      ${code}
                    </div>

                    <div style="margin-top:20px;">
                      <div style="display:inline-block; background:#0d1a30; border:1px solid #1e3a6e; border-radius:20px; padding:6px 16px;">
                        <span style="font-size:12px; color:#3b82f6; font-weight:500;">⏱ Expires in 10 minutes</span>
                      </div>
                    </div>
                  </div>

                  <!-- Security Note -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c1525; border:1px solid #1a2840; border-radius:10px; margin-bottom:36px;">
                    <tr>
                      <td style="padding:16px 20px;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="vertical-align:top; padding-right:12px; padding-top:2px; font-size:16px;">🔒</td>
                            <td style="font-size:13px; color:#4a5f80; line-height:1.7;">
                              <strong style="color:#6b7fa3; font-weight:500;">Security reminder:</strong> Never share this code with anyone. Institute Management System will never ask for your verification code.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <div style="border-top:1px solid #131e30; margin-bottom:28px;"></div>

                  <p style="font-size:13px; color:#3b4f6b; line-height:1.7; margin:0;">
                    If you did not initiate this registration, no action is required — this code will expire automatically.
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#060a12; border-radius:0 0 14px 14px; padding:22px 44px; border-top:1px solid #0f1a2e;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="font-size:11px; color:#243044; margin:0; line-height:1.7;">
                          This is an automated message. Please do not reply to this email.
                        </p>
                      </td>
                      <td align="right">
                        <p style="font-size:11px; color:#1e2d40; margin:0; white-space:nowrap;">© 2026 IMS</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};