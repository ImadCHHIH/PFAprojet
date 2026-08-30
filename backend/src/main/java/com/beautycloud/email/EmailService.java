package com.beautycloud.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendWelcomeEmail(
            String to,
            String firstName,
            String temporaryPassword) {

        String html = """
                <!DOCTYPE html>
                <html>
                <body style="
                    margin:0;
                    padding:40px;
                    background:#F4F6F9;
                    font-family:Arial,sans-serif;
                ">

                <table align="center"
                       width="650"
                       style="
                       background:white;
                       border-radius:12px;
                       overflow:hidden;
                       box-shadow:0 5px 15px rgba(0,0,0,.12);
                       ">

                <tr>
                    <td style="
                        background:#4F46E5;
                        padding:30px;
                        text-align:center;
                        color:white;
                        font-size:30px;
                        font-weight:bold;
                    ">
                        BeautyCloud
                    </td>
                </tr>

                <tr>
                    <td style="padding:40px;">

                        <h2 style="margin-top:0;">
                            Welcome %s 👋
                        </h2>

                        <p>
                            Your BeautyCloud account has been successfully created.
                        </p>

                        <p>
                            You can now access the administration platform.
                        </p>

                        <table
                            width="100%%"
                            style="
                            background:#F8F9FC;
                            border-radius:10px;
                            padding:20px;
                            margin-top:25px;
                            margin-bottom:25px;
                            ">

                            <tr>
                                <td>
                                    <strong>Email</strong>
                                </td>
                                <td>%s</td>
                            </tr>

                            <tr>
                                <td style="padding-top:15px;">
                                    <strong>Temporary Password</strong>
                                </td>

                                <td style="
                                    padding-top:15px;
                                    color:#4F46E5;
                                    font-size:18px;
                                    font-weight:bold;
                                ">
                                    %s
                                </td>

                            </tr>

                        </table>

                        <p>
                            For security reasons, please change your password
                            after your first login.
                        </p>

                        <div
                            style="
                            margin-top:35px;
                            text-align:center;
                            ">

                            <a
                            href="http://localhost:5173/login"
                            style="
                            background:#4F46E5;
                            color:white;
                            padding:14px 30px;
                            border-radius:8px;
                            text-decoration:none;
                            font-weight:bold;
                            ">
                            Login to BeautyCloud
                            </a>

                        </div>

                    </td>
                </tr>

                <tr>

                    <td style="
                    background:#F4F6F9;
                    text-align:center;
                    padding:25px;
                    color:#888;
                    font-size:13px;
                    ">

                    © 2026 BeautyCloud.
                    All rights reserved.

                    </td>

                </tr>

                </table>

                </body>
                </html>
                """.formatted(
                firstName,
                to,
                temporaryPassword
        );

        sendHtmlEmail(
                to,
                "Welcome to BeautyCloud",
                html
        );

    }

    public void sendSubscriptionExpiringEmail(
            String to,
            String companyName,
            long daysRemaining) {

        String html = """
                <!DOCTYPE html>
                <html>
                <body style="
                    margin:0;
                    padding:40px;
                    background:#F4F6F9;
                    font-family:Arial,sans-serif;
                ">

                <table align="center"
                       width="650"
                       style="
                       background:white;
                       border-radius:12px;
                       overflow:hidden;
                       box-shadow:0 5px 15px rgba(0,0,0,.12);
                       ">

                <tr>
                    <td style="
                        background:#4F46E5;
                        padding:30px;
                        text-align:center;
                        color:white;
                        font-size:30px;
                        font-weight:bold;
                    ">
                        BeautyCloud
                    </td>
                </tr>

                <tr>
                    <td style="padding:40px;">

                        <h2>
                            Subscription Expiration Reminder
                        </h2>

                        <p>
                            Hello,
                        </p>

                        <p>
                            This is a reminder that the subscription for
                            <strong>%s</strong>
                            will expire in
                            <strong>%d day(s)</strong>.
                        </p>

                        <p>
                            Please renew your subscription before the expiration
                            date to avoid any interruption of your services.
                        </p>

                        <div style="
                            background:#FFF8E5;
                            border-left:5px solid #F59E0B;
                            padding:20px;
                            margin:30px 0;
                        ">

                            <strong>
                                Remaining time:
                            </strong>

                            %d day(s)

                        </div>

                        <div style="
                            text-align:center;
                            margin-top:35px;
                        ">

                            <a
                                href="http://localhost:5173"
                                style="
                                background:#4F46E5;
                                color:white;
                                text-decoration:none;
                                padding:14px 30px;
                                border-radius:8px;
                                font-weight:bold;
                                ">
                                Login to BeautyCloud
                            </a>

                        </div>

                    </td>
                </tr>

                <tr>

                    <td style="
                    background:#F4F6F9;
                    text-align:center;
                    padding:25px;
                    color:#888;
                    font-size:13px;
                    ">

                    © 2026 BeautyCloud.
                    All rights reserved.

                    </td>

                </tr>

                </table>

                </body>
                </html>
                """.formatted(
                companyName,
                daysRemaining,
                daysRemaining
        );

        sendHtmlEmail(
                to,
                "Your BeautyCloud subscription is about to expire",
                html
        );

    }

    private void sendHtmlEmail(
            String to,
            String subject,
            String html) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);

        }

        catch (MessagingException e) {

            throw new RuntimeException(e);

        }

    }
    public void sendSubscriptionRenewedEmail(
            String to,
            String companyName,
            String planName,
            LocalDate expirationDate) {

        String html = """
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:40px;background:#F4F6F9;font-family:Arial,sans-serif;">

                <table align="center" width="650"
                       style="background:white;border-radius:12px;overflow:hidden;
                       box-shadow:0 5px 15px rgba(0,0,0,.12);">

                <tr>
                    <td style="background:#4F46E5;color:white;padding:30px;
                    text-align:center;font-size:28px;font-weight:bold;">
                        BeautyCloud
                    </td>
                </tr>

                <tr>
                    <td style="padding:40px;">

                        <h2>Subscription Renewed 🎉</h2>

                        <p>Your subscription has been renewed successfully.</p>

                        <table width="100%%"
                        style="background:#F8F9FC;padding:20px;border-radius:10px;">

                            <tr>
                                <td><strong>Company</strong></td>
                                <td>%s</td>
                            </tr>

                            <tr>
                                <td><strong>Plan</strong></td>
                                <td>%s</td>
                            </tr>

                            <tr>
                                <td><strong>Valid until</strong></td>
                                <td>%s</td>
                            </tr>

                        </table>

                        <p style="margin-top:25px;">
                            Thank you for continuing with BeautyCloud.
                        </p>

                    </td>
                </tr>

                </table>

                </body>
                </html>
                """.formatted(
                companyName,
                planName,
                expirationDate
        );

        sendHtmlEmail(
                to,
                "BeautyCloud Subscription Renewed",
                html
        );

    }
    public void sendSubscriptionExpiredEmail(
            String to,
            String companyName) {

        String html = """
                <html>
                <body style="font-family:Arial;background:#F4F6F9;padding:40px;">

                <div style="max-width:650px;margin:auto;background:white;
                padding:40px;border-radius:12px;">

                <h2 style="color:#DC2626;">
                Subscription Expired
                </h2>

                <p>

                Your subscription for

                <strong>%s</strong>

                has expired.

                </p>

                <p>

                Please renew it as soon as possible to continue using BeautyCloud.

                </p>

                </div>

                </body>
                </html>
                """.formatted(companyName);

        sendHtmlEmail(

                to,

                "BeautyCloud Subscription Expired",

                html

        );

    }
    public void sendPasswordChangedEmail(
            String to,
            String firstName) {

        String html = """
                <!DOCTYPE html>
                <html>
                <body style="
                    margin:0;
                    padding:40px;
                    background:#F4F6F9;
                    font-family:Arial,sans-serif;
                ">

                <table align="center"
                       width="650"
                       style="
                       background:white;
                       border-radius:12px;
                       overflow:hidden;
                       box-shadow:0 5px 15px rgba(0,0,0,.12);
                       ">

                    <tr>
                        <td style="
                            background:#4F46E5;
                            padding:30px;
                            text-align:center;
                            color:white;
                            font-size:30px;
                            font-weight:bold;
                        ">
                            BeautyCloud
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px;">

                            <h2>Password Changed 🔒</h2>

                            <p>Hello <strong>%s</strong>,</p>

                            <p>
                                Your BeautyCloud account password has been changed successfully.
                            </p>

                            <p>
                                If you made this change, no further action is required.
                            </p>

                            <div style="
                                background:#FFF8E5;
                                border-left:5px solid #F59E0B;
                                padding:20px;
                                margin:30px 0;
                            ">

                                <strong>Security Notice</strong>

                                <br><br>

                                If you did <strong>NOT</strong> change your password,
                                please contact your administrator immediately and secure
                                your account.

                            </div>

                            <div style="
                                text-align:center;
                                margin-top:35px;
                            ">

                                <a
                                    href="http://localhost:5173/login"
                                    style="
                                    background:#4F46E5;
                                    color:white;
                                    text-decoration:none;
                                    padding:14px 30px;
                                    border-radius:8px;
                                    font-weight:bold;
                                    ">
                                    Login to BeautyCloud
                                </a>

                            </div>

                        </td>
                    </tr>

                    <tr>

                        <td style="
                            background:#F4F6F9;
                            text-align:center;
                            padding:25px;
                            color:#888;
                            font-size:13px;
                        ">

                            © 2026 BeautyCloud.
                            All rights reserved.

                        </td>

                    </tr>

                </table>

                </body>
                </html>
                """.formatted(firstName);

        sendHtmlEmail(
                to,
                "BeautyCloud Password Changed",
                html
        );

    }

}