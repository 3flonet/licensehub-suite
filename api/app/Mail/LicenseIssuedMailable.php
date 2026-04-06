<?php

namespace App\Mail;

use App\Models\License;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LicenseIssuedMailable extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public License $license,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎉 Lisensi '.$this->license->product->name.' Anda Sudah Siap!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.license-issued',
            with: [
                'license' => $this->license,
                'customer' => $this->license->customer,
                'product' => $this->license->product,
                'plan' => $this->license->plan,
            ],
        );
    }
}
