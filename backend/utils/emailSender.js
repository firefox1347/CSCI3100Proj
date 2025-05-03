import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0
import emailCheck from './emailCheck.js';

// email: receiver's email
// name: receiver's name
// token: verification token for type 'verify',URL for reset password for type 'forgetPW', leave blanck for type 'resetSuccess'
// type: verify, forgetPW, resetSuccess
export const sendEmail = async (email, name, token, type)=> {
  // Configurations
  const DOMAIN = 'mail.papachk.top';
  const API_KEY = '5dc9c943c8275d6a8d7ddd19606164cb-e298dd8e-531c09cf';

  // Validate email
  if (!emailCheck(email)){
    throw new Error('Invalid recipient email');
  }

  // Initialize client
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: 'api',
    key: API_KEY
  });

  // Send email according to type
  switch (type)
  {
    case 'verify':
      mg.messages.create(DOMAIN, {
        from: `BlueBird Team <noreply@${DOMAIN}>`,
        to: [email],
        subject: "Verify Your Email",
        text: `Dear ${name},\n\nTo verify your email and complete your BlueBird account registration, type the token below into our webpage.\n\n${token}\n\nKind regards,\nBlueBird Team`,
        html: `Dear ${name},<br><br>To verify your email and complete your BlueBird account registration, type the token below into our webpage.<br><h2>${token}</h2><br>Kind regards,<br>BlueBird Team`
      })
      .then(msg => {
        console.log('Email sent. Message ID:', msg.id);
        console.log('Check inbox (and spam folder) within 2 minutes.');
      })
      .catch(err => {
        console.error('Error:', err.message);
        if (err.details) console.log('Error details:', err.details);
        throw new Error('Fail to send email');
      });
      break;
      
    case 'forgotPW':
      mg.messages.create(DOMAIN, {
        from: `BlueBird Team <noreply@${DOMAIN}>`,
        to: [email],
        subject: "Reset Your Password",
        text: `Dear ${name},\n\nTo reset your BlueBird account password, click the link below.\n\n${token}\n\nKind regards,\nBlueBird Team`,
        html: `Dear ${name},<br><br>To reset your BlueBird account password, click the link below.<br><h2><a href="${token}" target="_blank">Reset Password</a></h2><br>Kind regards,<br>BlueBird Team`
      })
      .then(msg => {
        console.log('Email sent. Message ID:', msg.id);
        console.log('Check inbox (and spam folder) within 2 minutes.');
      })
      .catch(err => {
        console.error('Error:', err.message);
        if (err.details) console.log('Error details:', err.details);
        throw new Error('Fail to send email');
      });
      break;

    case 'resetSuccess':
      mg.messages.create(DOMAIN, {
        from: `BlueBird Team <noreply@${DOMAIN}>`,
        to: [email],
        subject: "Reset Password Sucessfully!",
        text: `Dear ${name},\n\nYour password has been successfully reset.\n\nKind regards,\nBlueBird Team`,
        html: `Dear ${name},<br><br>Your password has been successfully reset.<br><br>Kind regards,<br>BlueBird Team`
      })
      .then(msg => {
        console.log('Email sent. Message ID:', msg.id);
        console.log('Check inbox (and spam folder) within 2 minutes.');
      })
      .catch(err => {
        console.error('Error:', err.message);
        if (err.details) console.log('Error details:', err.details);
        throw new Error('Fail to send email');
      });
      break;

    default:
      console.error('Invalid parameter type');
      throw new Error('Invalid parameter');
  }
}

export default sendEmail;
//TEST
// let email = ""
// let nam = "Blue Bird Team Member"
// sendEmail(email, nam, "https://google.com", "forgotPW");
// sendEmail(email, nam, "072123", "verify");
// sendEmail(email, nam, "", "resetSuccess");