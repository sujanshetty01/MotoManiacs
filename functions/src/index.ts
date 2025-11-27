import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// ============================================
// Talent Submission Notification Function
// ============================================

/**
 * Cloud Function: onTalentSubmissionCreate
 * 
 * Triggers when a new talent submission is created.
 * Actions:
 * 1. Sends notification to admins (simulated via logs in emulator)
 * 2. Creates a reviewTask document for admin review queue
 * 
 * This function is emulator-compatible and safe for development.
 */
export const onTalentSubmissionCreate = functions.firestore
    .document('talentSubmissions/{submissionId}')
    .onCreate(async (snapshot, context) => {
        const submissionId = context.params.submissionId;
        const submission = snapshot.data();

        try {
            console.log('🎓 New talent submission received:', {
                id: submissionId,
                studentName: submission.studentName,
                email: submission.contactEmail,
                college: submission.collegeName,
            });

            // ============================================
            // 1. Create Review Task
            // ============================================
            const reviewTask = {
                submissionType: 'talent',
                submissionId: submissionId,
                priority: 'Medium',
                status: 'Open',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                notes: `New talent submission from ${submission.studentName} at ${submission.collegeName}`,
            };

            await admin.firestore()
                .collection('reviewTasks')
                .add(reviewTask);

            console.log('✅ Review task created for submission:', submissionId);

            // ============================================
            // 2. Send Notification to Admins
            // ============================================

            // In production, this would send an email via SendGrid, Mailgun, etc.
            // For emulator/development, we log to console
            const notificationMessage = {
                to: functions.config()?.admin?.email || 'admin@motomaniacs.com',
                subject: '🎓 New Talent Hunt Submission',
                body: `
          New talent submission received!
          
          Student: ${submission.studentName}
          College: ${submission.collegeName}
          Email: ${submission.contactEmail}
          Phone: ${submission.contactPhone}
          Skills: ${submission.skillCategories?.join(', ') || 'N/A'}
          
          Resume: ${submission.resumeUrl}
          ${submission.demoVideoUrl ? `Demo Video: ${submission.demoVideoUrl}` : ''}
          ${submission.profileLink ? `Profile: ${submission.profileLink}` : ''}
          
          Review this submission at:
          https://motomaniacs.app/admin/dashboard#talent-review
          
          Submission ID: ${submissionId}
        `,
            };

            // Simulate email sending (in production, integrate with email service)
            console.log('📧 Notification email (simulated):', notificationMessage);

            // In production, you would use an email service:
            /*
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(functions.config().sendgrid.key);
            await sgMail.send({
              to: functions.config().admin.email,
              from: 'noreply@motomaniacs.com',
              subject: notificationMessage.subject,
              text: notificationMessage.body,
            });
            */

            // ============================================
            // 3. Update Submission with Notification Status
            // ============================================

            await snapshot.ref.update({
                notificationSent: true,
                notificationSentAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log('✅ Talent submission processing complete');

            return { success: true, submissionId };

        } catch (error) {
            console.error('❌ Error processing talent submission:', error);

            // Log error but don't fail the function
            // This ensures the submission is still saved even if notification fails
            await snapshot.ref.update({
                notificationError: error instanceof Error ? error.message : 'Unknown error',
                notificationSent: false,
            });

            // Don't throw - we want the submission to be saved regardless
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    });

// ============================================
// Campus Registration Notification Function
// ============================================

/**
 * Cloud Function: onCampusRegistrationCreate
 * 
 * Triggers when a new campus registration is created.
 * Actions:
 * 1. Sends notification to admins
 * 2. Creates a reviewTask document
 */
export const onCampusRegistrationCreate = functions.firestore
    .document('campusRegistrations/{registrationId}')
    .onCreate(async (snapshot, context) => {
        const registrationId = context.params.registrationId;
        const registration = snapshot.data();

        try {
            console.log('🏫 New campus registration received:', {
                id: registrationId,
                college: registration.collegeName,
                contact: registration.contactPerson,
            });

            // Create review task
            const reviewTask = {
                submissionType: 'campus',
                submissionId: registrationId,
                priority: 'High', // Campus registrations are high priority
                status: 'Open',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                notes: `New campus activation request from ${registration.collegeName}`,
            };

            await admin.firestore()
                .collection('reviewTasks')
                .add(reviewTask);

            console.log('✅ Review task created for campus registration:', registrationId);

            // Simulate notification
            const notificationMessage = {
                to: functions.config()?.admin?.email || 'admin@motomaniacs.com',
                subject: '🏫 New Campus Activation Request',
                body: `
          New campus activation request!
          
          College: ${registration.collegeName}
          Contact Person: ${registration.contactPerson}
          Email: ${registration.contactEmail}
          Phone: ${registration.contactPhone}
          Preferred Dates: ${registration.preferredDates?.join(', ') || 'N/A'}
          
          Message: ${registration.message || 'No message provided'}
          
          Review at:
          https://motomaniacs.app/admin/dashboard#campus-review
          
          Registration ID: ${registrationId}
        `,
            };

            console.log('📧 Notification email (simulated):', notificationMessage);

            // Update registration with notification status
            await snapshot.ref.update({
                notificationSent: true,
                notificationSentAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log('✅ Campus registration processing complete');

            return { success: true, registrationId };

        } catch (error) {
            console.error('❌ Error processing campus registration:', error);

            await snapshot.ref.update({
                notificationError: error instanceof Error ? error.message : 'Unknown error',
                notificationSent: false,
            });

            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    });


