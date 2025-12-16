"""
Email service for sending notifications to users and admin.
Supports SMTP-based email sending (Gmail, Outlook, etc.)
"""
import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Optional

log = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via SMTP"""

    def __init__(self):
        self.smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.environ.get("SMTP_PORT", "587"))
        self.smtp_user = os.environ.get("SMTP_USER")
        self.smtp_password = os.environ.get("SMTP_PASSWORD")
        self.from_email = os.environ.get("SMTP_FROM_EMAIL")
        self.from_name = os.environ.get("SMTP_FROM_NAME", "TrackMyProgress")
        self.admin_email = os.environ.get("ADMIN_EMAIL")

    def is_configured(self) -> bool:
        """Check if email service is properly configured"""
        return bool(self.smtp_user and self.smtp_password and self.from_email)

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
    ) -> bool:
        """
        Send email via SMTP
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML content of the email
            text_content: Plain text fallback content
            
        Returns:
            True if successful, False otherwise
        """
        if not self.is_configured():
            log.warning("Email service not configured. Skipping email send.")
            return False

        try:
            # Create message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = to_email

            # Attach text and HTML parts
            if text_content:
                msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)

            log.info(f"✅ Email sent to {to_email}")
            return True

        except Exception as e:
            log.error(f"❌ Failed to send email: {e}")
            return False

    def send_login_notification(self, user_email: str, user_name: str) -> bool:
        """Send login notification email"""
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #0066cc;">Welcome Back! 🎉</h2>
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>You've successfully logged into <strong>TrackMyProgress</strong>.</p>
                    <p><strong>Login Details:</strong></p>
                    <ul>
                        <li>Email: {user_email}</li>
                        <li>Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC</li>
                    </ul>
                    <p style="color: #666; font-size: 12px;">
                        If you didn't perform this login, please contact our support team immediately.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2025 TrackMyProgress. All rights reserved. | Powered by Google Gemini AI
                    </p>
                </div>
            </body>
        </html>
        """
        
        text_content = f"""
Welcome Back!

Hi {user_name},

You've successfully logged into TrackMyProgress.

Login Details:
- Email: {user_email}
- Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC

If you didn't perform this login, please contact our support team immediately.

© 2025 TrackMyProgress. All rights reserved.
        """

        return self.send_email(user_email, "TrackMyProgress - Login Notification ✅", html_content, text_content)

    def send_feedback_notification(self, user_email: str, user_name: str, feedback: str) -> bool:
        """Send feedback notification to admin"""
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #0066cc;">📝 New User Feedback</h2>
                    <p><strong>From:</strong> {user_name} ({user_email})</p>
                    <p><strong>Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <h3>Feedback Message:</h3>
                    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #0066cc; border-radius: 4px;">
                        <p style="margin: 0; white-space: pre-wrap;">{feedback}</p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">
                        Please reply to {user_email} to respond to this feedback.
                    </p>
                </div>
            </body>
        </html>
        """
        
        text_content = f"""
New User Feedback

From: {user_name} ({user_email})
Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC

Feedback Message:
{feedback}

Please reply to {user_email} to respond to this feedback.
        """

        subject = f"TrackMyProgress - New Feedback from {user_name}"
        return self.send_email(self.admin_email, subject, html_content, text_content)

    def send_contact_response(self, user_email: str, user_name: str) -> bool:
        """Send contact form received acknowledgment"""
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #0066cc;">Thank You for Contacting Us! 💌</h2>
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>Thank you for reaching out to <strong>TrackMyProgress</strong>!</p>
                    <p>We have received your message and our team will get back to you as soon as possible.</p>
                    <p style="color: #666; font-size: 14px;">
                        <strong>Your Email:</strong> {user_email}
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        <strong>Response Time:</strong> Usually within 24-48 hours
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2025 TrackMyProgress. All rights reserved. | Powered by Google Gemini AI
                    </p>
                </div>
            </body>
        </html>
        """
        
        text_content = f"""
Thank You for Contacting Us!

Hi {user_name},

Thank you for reaching out to TrackMyProgress!

We have received your message and our team will get back to you as soon as possible.

Your Email: {user_email}
Response Time: Usually within 24-48 hours

© 2025 TrackMyProgress. All rights reserved.
        """

        return self.send_email(user_email, "TrackMyProgress - Contact Form Received ✅", html_content, text_content)


# Create a singleton instance
email_service = EmailService()
