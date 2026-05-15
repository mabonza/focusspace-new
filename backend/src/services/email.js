'use strict'

const BRAND_COLOR = '#7c2d49'
const GOLD_COLOR = '#c9a84c'
const LOGO_B64 = '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'

function layout(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;max-width:600px;">
        <!-- Header -->
        <tr>
          <td style="background:${BRAND_COLOR};padding:24px 36px;">
            <img src="data:image/png;base64,${LOGO_B64}" alt="Focus Space" width="160" style="display:block;max-width:160px;height:auto;margin-bottom:6px;">
            <p style="margin:0;color:rgba(255,255,255,0.75);font-size:11px;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">
              Academic Conference Platform
            </p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px;">
            ${bodyHtml}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f8f8;border-top:1px solid #eeeeee;padding:20px 36px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#999999;font-family:Arial,sans-serif;">
              Focus Space · Learning and Teaching Development Centre (LTDC) · Mangosuthu University of Technology<br>
              focusconference@mut.ac.za · +27 31 907 7175
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function btn(label, url) {
  return `<a href="${url}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:3px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;margin-top:8px;">${label}</a>`
}

function greeting(firstName) {
  return `<p style="margin:0 0 16px;font-size:16px;color:#333333;">Dear <strong>${firstName}</strong>,</p>`
}

function closing() {
  return `<p style="margin:24px 0 0;font-size:14px;color:#666666;font-family:Arial,sans-serif;">Warm regards,<br><strong style="color:${BRAND_COLOR};">The Focus Conference Team</strong></p>`
}

const TEMPLATES = {
  'registration-confirmation': (data) => ({
    subject: `Registration Confirmed — ${data.conference}`,
    text: `Dear ${data.firstName},\n\nYour registration for ${data.conference} has been confirmed.\nInvoice: ${data.invoiceNumber}\n\nThank you,\nFocus Space`,
    html: layout('Registration Confirmed', `
      ${greeting(data.firstName)}
      <p style="font-size:15px;color:#333333;margin:0 0 16px;">
        Your registration for <strong style="color:${BRAND_COLOR};">${data.conference}</strong> has been confirmed.
      </p>
      <table style="width:100%;background:#f9f5f6;border-left:4px solid ${BRAND_COLOR};border-radius:2px;padding:16px;margin:0 0 20px;border-spacing:0;">
        <tr><td style="font-size:13px;color:#666666;font-family:Arial,sans-serif;padding:4px 16px;">
          <strong>Invoice Number:</strong> ${data.invoiceNumber}
        </td></tr>
      </table>
      <p style="font-size:14px;color:#555555;margin:0 0 20px;font-family:Arial,sans-serif;">
        Please log in to your dashboard to view your invoice and complete payment via EFT.
      </p>
      ${btn('Go to My Dashboard', `${data.dashboardUrl || 'http://localhost:3000/dashboard'}`)}
      ${closing()}
    `),
  }),

  'invoice-issued': (data) => ({
    subject: `Invoice ${data.invoiceNumber} — ${data.conference}`,
    text: `Dear ${data.firstName},\n\nYour invoice ${data.invoiceNumber} for ${data.conference} has been issued.\nAmount: ${data.currency} ${data.amount}\n\nPlease complete payment to confirm your attendance.\n\nFocus Space`,
    html: layout(`Invoice ${data.invoiceNumber}`, `
      ${greeting(data.firstName)}
      <p style="font-size:15px;color:#333333;margin:0 0 16px;">
        Your invoice for <strong style="color:${BRAND_COLOR};">${data.conference}</strong> has been issued.
      </p>
      <table style="width:100%;background:#f9f5f6;border-left:4px solid ${GOLD_COLOR};border-radius:2px;margin:0 0 20px;border-spacing:0;">
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#666666;padding:12px 16px;">
          <div style="margin-bottom:6px;"><strong>Invoice:</strong> ${data.invoiceNumber}</div>
          <div style="margin-bottom:6px;"><strong>Amount Due:</strong> <span style="color:${BRAND_COLOR};font-size:18px;font-weight:bold;">${data.currency} ${data.amount}</span></div>
          <div><strong>Payment Method:</strong> EFT / Bank Transfer</div>
        </td></tr>
      </table>
      <p style="font-size:13px;color:#555555;margin:0 0 20px;font-family:Arial,sans-serif;">
        Please use your invoice number as the payment reference when making your EFT payment.
        Upload your proof of payment on your dashboard once the transfer is complete.
      </p>
      ${btn('View Invoice & Pay', `${data.dashboardUrl || 'http://localhost:3000/dashboard/invoices'}`)}
      ${closing()}
    `),
  }),

  'abstract-submitted': (data) => ({
    subject: `Abstract Received — ${data.title}`,
    text: `Dear ${data.firstName},\n\nWe have received your abstract "${data.title}". It is now under review.\n\nFocus Space`,
    html: layout('Abstract Received', `
      ${greeting(data.firstName)}
      <p style="font-size:15px;color:#333333;margin:0 0 16px;">
        Thank you for submitting your abstract to the Focus Conference. We have received it successfully.
      </p>
      <table style="width:100%;background:#f9f5f6;border-left:4px solid ${BRAND_COLOR};border-radius:2px;margin:0 0 20px;border-spacing:0;">
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#666666;padding:12px 16px;">
          <strong>Abstract Title:</strong> ${data.title}
        </td></tr>
      </table>
      <p style="font-size:14px;color:#555555;margin:0 0 20px;font-family:Arial,sans-serif;">
        Your abstract will be reviewed by our scientific committee. You will be notified of the decision via email.
      </p>
      ${btn('Track Your Abstract', data.dashboardUrl || 'http://localhost:3000/dashboard/abstracts')}
      ${closing()}
    `),
  }),

  'abstract-accepted': (data) => ({
    subject: `Abstract Accepted — ${data.title}`,
    text: `Dear ${data.firstName},\n\nCongratulations! Your abstract "${data.title}" has been accepted for presentation.\n\nFocus Space`,
    html: layout('Abstract Accepted', `
      ${greeting(data.firstName)}
      <p style="font-size:15px;color:#333333;margin:0 0 16px;">
        <strong style="color:#2d7a4f;">Congratulations!</strong> Your abstract has been accepted for presentation at the Focus Conference.
      </p>
      <table style="width:100%;background:#f0faf4;border-left:4px solid #2d7a4f;border-radius:2px;margin:0 0 20px;border-spacing:0;">
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#333333;padding:12px 16px;">
          <strong>Abstract Title:</strong> ${data.title}
        </td></tr>
      </table>
      <p style="font-size:14px;color:#555555;margin:0 0 20px;font-family:Arial,sans-serif;">
        Further details regarding your presentation slot and schedule will be communicated in due course.
        Please ensure your conference registration and payment are up to date.
      </p>
      ${btn('View My Abstracts', data.dashboardUrl || 'http://localhost:3000/dashboard/abstracts')}
      ${closing()}
    `),
  }),

  'abstract-rejected': (data) => ({
    subject: `Abstract Decision — ${data.title}`,
    text: `Dear ${data.firstName},\n\nThank you for submitting "${data.title}". After careful review, it was not accepted this time.\n\nFocus Space`,
    html: layout('Abstract Decision', `
      ${greeting(data.firstName)}
      <p style="font-size:15px;color:#333333;margin:0 0 16px;">
        Thank you for submitting your abstract to the Focus Conference. After careful review by our scientific committee, we regret to inform you that your abstract was not accepted for this conference.
      </p>
      <table style="width:100%;background:#f9f5f6;border-left:4px solid #999;border-radius:2px;margin:0 0 20px;border-spacing:0;">
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#666666;padding:12px 16px;">
          <strong>Abstract Title:</strong> ${data.title}
        </td></tr>
      </table>
      <p style="font-size:14px;color:#555555;margin:0 0 20px;font-family:Arial,sans-serif;">
        We encourage you to consider submitting to future conferences. Thank you for your contribution to academic discourse.
      </p>
      ${closing()}
    `),
  }),

  'abstract-revision-requested': (data) => ({
    subject: `Revision Required — ${data.title}`,
    text: `Dear ${data.firstName},\n\nYour abstract "${data.title}" requires revision before it can be accepted.\n\n${data.comments ? `Feedback: ${data.comments}\n\n` : ''}Please log in to your dashboard to update your abstract.\n\nFocus Space`,
    html: layout('Revision Required', `
      ${greeting(data.firstName)}
      <p style="font-size:15px;color:#333333;margin:0 0 16px;">
        Your abstract has been reviewed and requires revision before a final decision can be made.
      </p>
      <table style="width:100%;background:#fffbf0;border-left:4px solid ${GOLD_COLOR};border-radius:2px;margin:0 0 20px;border-spacing:0;">
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#666666;padding:12px 16px;">
          <div style="margin-bottom:6px;"><strong>Abstract Title:</strong> ${data.title}</div>
          ${data.comments ? `<div style="margin-top:8px;"><strong>Reviewer Feedback:</strong><br><em>${data.comments}</em></div>` : ''}
        </td></tr>
      </table>
      <p style="font-size:14px;color:#555555;margin:0 0 20px;font-family:Arial,sans-serif;">
        Please log in to your dashboard, update your abstract based on the feedback, and resubmit.
      </p>
      ${btn('Edit & Resubmit', data.dashboardUrl || 'http://localhost:3000/dashboard/abstracts')}
      ${closing()}
    `),
  }),

  'reviewer-assignment': (data) => ({
    subject: `Review Assignment — ${data.abstractTitle}`,
    text: `Dear ${data.firstName},\n\nYou have been assigned to review the abstract "${data.abstractTitle}".\n\nPlease log in to your dashboard to submit your review.\n\nFocus Space`,
    html: layout('New Review Assignment', `
      ${greeting(data.firstName)}
      <p style="font-size:15px;color:#333333;margin:0 0 16px;">
        You have been assigned to review an abstract for the Focus Conference. Please read the abstract carefully and submit your review at your earliest convenience.
      </p>
      <table style="width:100%;background:#f9f5f6;border-left:4px solid ${BRAND_COLOR};border-radius:2px;margin:0 0 20px;border-spacing:0;">
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#666666;padding:12px 16px;">
          <strong>Abstract Title:</strong> ${data.abstractTitle}
        </td></tr>
      </table>
      ${btn('Go to My Reviews', data.dashboardUrl || 'http://localhost:3000/dashboard/reviews')}
      ${closing()}
    `),
  }),

  'payment-approved': (data) => ({
    subject: `Payment Approved — ${data.invoiceNumber}`,
    text: `Dear ${data.firstName},\n\nYour payment for ${data.conference} (${data.invoiceNumber}) has been verified and approved.\n\nFocus Space`,
    html: layout('Payment Approved', `
      ${greeting(data.firstName)}
      <p style="font-size:15px;color:#333333;margin:0 0 16px;">
        <strong style="color:#2d7a4f;">Great news!</strong> Your payment has been verified and approved.
      </p>
      <table style="width:100%;background:#f0faf4;border-left:4px solid #2d7a4f;border-radius:2px;margin:0 0 20px;border-spacing:0;">
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#333333;padding:12px 16px;">
          <div><strong>Conference:</strong> ${data.conference}</div>
          <div style="margin-top:4px;"><strong>Invoice:</strong> ${data.invoiceNumber}</div>
        </td></tr>
      </table>
      <p style="font-size:14px;color:#555555;margin:0 0 20px;font-family:Arial,sans-serif;">
        Your attendance at the Focus Conference is confirmed. We look forward to seeing you there.
      </p>
      ${btn('My Dashboard', data.dashboardUrl || 'http://localhost:3000/dashboard')}
      ${closing()}
    `),
  }),

  'payment-rejected': (data) => ({
    subject: `Payment Requires Attention — ${data.invoiceNumber}`,
    text: `Dear ${data.firstName},\n\nYour payment proof for ${data.conference} (${data.invoiceNumber}) could not be verified. Reason: ${data.reason}\n\nPlease re-upload your proof or contact support.\n\nFocus Space`,
    html: layout('Payment Requires Attention', `
      ${greeting(data.firstName)}
      <p style="font-size:15px;color:#333333;margin:0 0 16px;">
        Your proof of payment for the Focus Conference could not be verified and requires your attention.
      </p>
      <table style="width:100%;background:#fff5f5;border-left:4px solid #c0392b;border-radius:2px;margin:0 0 20px;border-spacing:0;">
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#666666;padding:12px 16px;">
          <div><strong>Invoice:</strong> ${data.invoiceNumber}</div>
          <div style="margin-top:4px;"><strong>Reason:</strong> ${data.reason}</div>
        </td></tr>
      </table>
      <p style="font-size:14px;color:#555555;margin:0 0 20px;font-family:Arial,sans-serif;">
        Please re-upload a clear copy of your EFT payment confirmation or contact us directly.
      </p>
      ${btn('Upload Proof of Payment', data.dashboardUrl || 'http://localhost:3000/dashboard/payments')}
      ${closing()}
    `),
  }),

  'password-reset': (data) => ({
    subject: 'Reset Your Focus Space Password',
    text: `Hello,\n\nClick the link below to reset your password:\n${data.resetUrl}\n\nThis link expires in 1 hour.\n\nFocus Space`,
    html: layout('Reset Your Password', `
      <p style="font-size:15px;color:#333333;margin:0 0 16px;">
        We received a request to reset the password for your Focus Space account.
      </p>
      <p style="font-size:14px;color:#555555;margin:0 0 24px;font-family:Arial,sans-serif;">
        Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
      </p>
      ${btn('Reset My Password', data.resetUrl)}
      <p style="margin:20px 0 0;font-size:12px;color:#999999;font-family:Arial,sans-serif;">
        If you did not request a password reset, please ignore this email.
      </p>
    `),
  }),
}

/**
 * Send an email using a named template.
 * @param {import('@strapi/strapi').Strapi} strapi
 * @param {string} templateKey
 * @param {string} to recipient email
 * @param {Record<string, string>} data template variables
 */
async function sendTemplateEmail(strapi, templateKey, to, data) {
  const template = TEMPLATES[templateKey]
  if (!template) {
    strapi.log.warn(`[Email] Unknown template: ${templateKey}`)
    return
  }

  const { subject, text, html } = template(data)

  try {
    if (strapi.plugins['email']) {
      await strapi.plugins['email'].services.email.send({ to, subject, text, html })
      strapi.log.info(`[Email] Sent "${templateKey}" to ${to}`)
    } else {
      strapi.log.info(`[Email:DEV] To: ${to} | Template: ${templateKey} | Subject: ${subject}`)
    }
  } catch (err) {
    strapi.log.warn(`[Email] Failed to send "${templateKey}" to ${to}: ${err.message}`)
  }
}

module.exports = { sendTemplateEmail }
