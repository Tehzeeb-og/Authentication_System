exports.generateOtp=()=>{
return Math.floor(100000+Math.random()*900000).toString()
}

exports.gmailHtml=(userName,otp)=>{
return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
          <h1 style="color: #333;">Hello, ${userName}!</h1>
          <h1 style="color: #333;">This is your OTP </h1>
          <p style="font-size: 16px; color: #555;">${otp}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">verify your email to continue with us</p>
        </div>
      </body>
    </html>
  `
}