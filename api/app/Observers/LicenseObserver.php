<?php

namespace App\Observers;

use App\Mail\LicenseIssuedMailable;
use App\Models\License;
use Illuminate\Support\Facades\Mail;

class LicenseObserver
{
    /**
     * Handle the License "created" event.
     */
    public function created(License $license): void
    {
        // Handled via NotificationService manually to ensure Email + WA consistency
        /*
        if ($license->customer->email) {
            Mail::queue(new LicenseIssuedMailable($license));
        }
        */
    }

    /**
     * Handle the License "updated" event.
     */
    public function updated(License $license): void
    {
        //
    }

    /**
     * Handle the License "deleted" event.
     */
    public function deleted(License $license): void
    {
        //
    }

    /**
     * Handle the License "restored" event.
     */
    public function restored(License $license): void
    {
        //
    }

    /**
     * Handle the License "force deleted" event.
     */
    public function forceDeleted(License $license): void
    {
        //
    }
}
