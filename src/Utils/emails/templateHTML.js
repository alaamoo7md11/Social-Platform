export const activateTemplate = ({ otp, userName = "3la2" }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Account</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    ">

      <div style="
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      ">

        <!-- Header -->
        <div style="
          background: #2563eb;
          padding: 25px;
          text-align: center;
          color: white;
        ">
          <h1 style="margin: 0; font-size: 28px;">
            Welcome to Social Applications
          </h1>
        </div>

        <!-- Content -->
        <div style="padding: 35px 30px;">

          <h2 style="
            margin-top: 0;
            color: #222;
          ">
            Verify Your Account
          </h2>

          <p style="
            color: #555;
            font-size: 16px;
            line-height: 1.6;
          ">
            Hello ${userName},
          </p>

          <p style="
            color: #555;
            font-size: 16px;
            line-height: 1.6;
          ">
            Thank you for creating an account with Scholara.
            Please use the verification code below to verify your email address.
          </p>

          <!-- OTP -->
          <div style="
            text-align: center;
            margin: 30px 0;
          ">
            <div style="
              display: inline-block;
              padding: 18px 35px;
              background: #f1f5ff;
              border: 2px dashed #2563eb;
              border-radius: 10px;
              color: #2563eb;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
            ">
              ${otp}
            </div>
          </div>

          <p style="
            color: #777;
            font-size: 14px;
            text-align: center;
          ">
            This verification code will expire in <strong>10 minutes</strong>.
          </p>

          <p style="
            color: #777;
            font-size: 14px;
            line-height: 1.5;
          ">
            If you did not create this account, you can safely ignore this email.
          </p>

        </div>

        <!-- Footer -->
        <div style="
          background: #f8fafc;
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 13px;
        ">
          © 2026 Scholara. All rights reserved.
        </div>

      </div>

    </body>
    </html>
  `;
};
export const forgotPasswordOtpTemplate = ({ otp, userName = "User" }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset OTP</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    ">

      <div style="
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      ">

        <!-- Header -->
        <div style="
          background-color: #2563eb;
          padding: 25px;
          text-align: center;
        ">
          <h1 style="
            margin: 0;
            color: #ffffff;
            font-size: 28px;
          ">
            Scholara
          </h1>
        </div>

        <!-- Content -->
        <div style="padding: 35px 30px;">

          <h2 style="
            margin-top: 0;
            color: #222222;
          ">
            Reset Your Password
          </h2>

          <p style="
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
          ">
            Hello ${userName},
          </p>

          <p style="
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
          ">
            We received a request to reset your Scholara password.
            Use the verification code below to continue.
          </p>

          <!-- OTP -->
          <div style="
            text-align: center;
            margin: 30px 0;
          ">
            <div style="
              display: inline-block;
              padding: 18px 35px;
              background-color: #f1f5ff;
              border: 2px dashed #2563eb;
              border-radius: 10px;
              color: #2563eb;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
            ">
              ${otp}
            </div>
          </div>

          <p style="
            color: #777777;
            font-size: 14px;
            text-align: center;
          ">
            This code will expire in <strong>3 minutes</strong>.
          </p>

          <p style="
            color: #777777;
            font-size: 14px;
            line-height: 1.6;
          ">
            If you did not request a password reset, you can safely ignore
            this email. Your password will remain unchanged.
          </p>

        </div>

        <!-- Footer -->
        <div style="
          background-color: #f8fafc;
          padding: 20px;
          text-align: center;
          color: #999999;
          font-size: 13px;
        ">
          © 2026 Scholara. All rights reserved.
        </div>

      </div>

    </body>
    </html>
  `;
};

export const updateEmailTemplate = ({ link }) => {
  console.log("LINK:", link);
  console.log("LINK TYPE:", typeof link);
  return `
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Update Email</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f7fb;
  font-family: Arial, Helvetica, sans-serif;
">

  <div style="
    max-width: 600px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
  ">

    <div style="
      background: #2563eb;
      padding: 30px;
      text-align: center;
      color: white;
    ">
      <h1>Update Your Email</h1>
    </div>

    <div style="padding: 35px 30px; color: #333;">

      <h2>Verify Your New Email</h2>

      <p style="font-size: 16px; line-height: 1.6;">
        We received a request to change the email address
        associated with your Skolara account.
      </p>

      <p style="font-size: 16px; line-height: 1.6;">
        Click the button below to confirm your new email address.
      </p>

      <div style="text-align: center; margin: 35px 0;">
        <a
          href="${link}"
          style="
            display: inline-block;
            padding: 14px 28px;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
          "
        >
          Verify New Email
        </a>
      </div>

      <p style="font-size: 14px; color: #666; line-height: 1.5;">
        This verification link will expire soon.
        If you did not request this change, please ignore this email.
      </p>

      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>Skolara Team</strong>
      </p>

    </div>

    <div style="
      padding: 20px;
      background: #f8fafc;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
    ">
    </div>

  </div>

</body>
</html>
`;
};
