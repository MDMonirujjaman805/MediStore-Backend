const sendEmail = async ({ to, subject, text }: { to: string; subject: string; text: string }) => {
  // Placeholder for actual email sending logic
  console.log(`Sending email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
};

export { sendEmail };