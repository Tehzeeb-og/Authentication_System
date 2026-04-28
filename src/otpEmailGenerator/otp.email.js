exports.generateOtp=()=>{
return Math.floor(100000+Math.random()*900000).toString()
}

exports.gmailHtml = (userName, otp) => {
  const safeName = userName || 'there';
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 40px 20px;">
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
        <tr>
          <td align="center">
            
            <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); text-align: left;">
              <h1 style="color: #333333; font-size: 24px; margin-top: 0; margin-bottom: 20px;">Hello, ${safeName}!</h1>
              
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Thank you for registering. To verify your email address and continue, please use the One-Time Password (OTP) below:
              </p>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="display: inline-block; background-color: #f8f9fa; color: #2c3e50; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 8px; border: 2px dashed #cbd5e1;">
                  ${otp}
                </span>
              </div>
              
              <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
                <strong>Note:</strong> This code is valid for a limited time. Please do not share this code with anyone.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
              
              <p style="color: #999999; font-size: 12px; line-height: 1.5; text-align: center; margin-bottom: 0;">
                If you didn't request this email, you can safely ignore it.<br>
                &copy; ${currentYear} Demo Authentication Email. All rights reserved.
              </p>
            </div>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
};