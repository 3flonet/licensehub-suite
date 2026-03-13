<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SupportController extends Controller
{
    /**
     * Store a newly created contact request in storage.
     */
    public function contact(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $contact = ContactRequest::create([
                'name'    => $request->name,
                'email'   => $request->email,
                'subject' => $request->subject,
                'message' => $request->message,
                'status'  => 'pending'
            ]);

            // --- Notify Admin via WhatsApp ---
            try {
                $site = app(\App\Settings\SiteSettings::class);
                if ($adminPhone = $site->support_whatsapp) {
                    $notifyMsg = "🔔 *PESAN KONTAK BARU*\n\n" .
                               "Dari: {$request->name} ({$request->email})\n" .
                               "Subjek: {$request->subject}\n\n" .
                               "Pesan:\n{$request->message}\n\n" .
                               "--- 🚀 " . config('app.name');
                    
                    \App\Services\WhatsAppService::sendMessage($adminPhone, $notifyMsg);
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Failed to notify admin of contact request: " . $e->getMessage());
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully. We will get back to you soon.',
                'data'    => $contact
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
