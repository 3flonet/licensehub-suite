<?php

namespace App\Jobs;

use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWhatsAppMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $target,
        public string $message
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Executing SendWhatsAppMessageJob for {$this->target}");

        $success = WhatsAppService::sendMessage($this->target, $this->message);

        if (! $success) {
            throw new \Exception("Failed to send WhatsApp message to {$this->target} from Job.");
        }
    }
}
