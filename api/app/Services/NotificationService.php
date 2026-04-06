<?php

namespace App\Services;

use App\Mail\LicenseIssuedMailable;
use App\Models\License;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Send license delivery notification (Email & WhatsApp)
     */
    public function sendLicenseDelivery(License $license)
    {
        $this->sendEmail($license);
        $this->sendWhatsApp($license);
    }

    /**
     * Send Email Notification
     */
    protected function sendEmail(License $license)
    {
        try {
            Mail::to($license->customer->email)->send(new LicenseIssuedMailable($license));
        } catch (\Exception $e) {
            Log::error("Failed to send email for license {$license->id}: ".$e->getMessage());
        }
    }

    /**
     * Send WhatsApp Notification via Fonnte
     */
    protected function sendWhatsApp(License $license)
    {
        $license->load(['customer', 'product', 'plan']);

        if (! $license->customer->phone) {
            Log::warning("No phone number for customer {$license->customer->id}, skipping WhatsApp.");

            return;
        }

        try {
            $message = $license->getFormattedMessage();
            $success = WhatsAppService::sendMessage($license->customer->phone, $message);

            if ($success) {
            } else {
                Log::error("Failed to send WhatsApp via Service for license {$license->id}");
            }
        } catch (\Exception $e) {
            Log::error('WhatsApp Notification Logic Error: '.$e->getMessage());
        }
    }
}
