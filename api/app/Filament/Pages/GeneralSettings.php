<?php

namespace App\Filament\Pages;

use App\Settings\FonnteSettings;
use App\Settings\MailSettings;
use App\Settings\MidtransSettings;
use App\Settings\SiteSettings;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class GeneralSettings extends Page
{
    use InteractsWithForms;

    protected static ?string $navigationLabel = 'System Settings';

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationGroup = 'System';

    protected static ?int $navigationSort = 99;

    protected static string $view = 'filament.pages.general-settings';

    public function getTitle(): string
    {
        return 'System Settings';
    }

    // ─── Public Livewire Properties (form state) ─────────────────────────────
    // Midtrans
    public string $midtrans_merchant_id = '';

    public string $midtrans_client_key = '';

    public string $midtrans_server_key = '';

    public bool $midtrans_is_production = false;

    // Fonnte
    public string $fonnte_token = '';

    public string $fonnte_sender = '';

    // Mail
    public string $mail_host = '';

    public string $mail_port = '587';

    public string $mail_username = '';

    public string $mail_password = '';

    public string $mail_encryption = 'tls';

    public string $mail_from_address = '';

    public string $mail_from_name = '';

    // Site & SEO
    public string $site_name = '3Flo LicenseHub';

    public string $site_tagline = 'Professional License Management System';

    public string $site_description = '';

    public string $site_keywords = '';

    public string $site_url = '';

    public $site_logo = null;

    public $site_logo_dark = null;

    public $site_favicon = null;

    public $og_image_url = null;

    public string $twitter_handle = '';

    public string $support_email = '';

    public string $support_whatsapp = '';

    public ?string $telegram_group = null;

    public string $company_name = '3Flo';

    public string $company_address = '';

    // Social Links
    public ?string $social_facebook = null;

    public ?string $social_instagram = null;

    public ?string $social_github = null;

    public ?string $social_linkedin = null;

    public ?string $social_youtube = null;

    // Maintenance
    public bool $is_maintenance_mode = false;

    public string $maintenance_message = 'LicenseHub is currently undergoing scheduled maintenance. Please check back soon.';

    public function mount(): void
    {
        try {
            $midtrans = app(MidtransSettings::class);
            $fonnte = app(FonnteSettings::class);
            $mail = app(MailSettings::class);
            $site = app(SiteSettings::class);

            $this->form->fill([
                'midtrans_merchant_id' => $midtrans->merchant_id,
                'midtrans_client_key' => $midtrans->client_key,
                'midtrans_server_key' => $midtrans->server_key,
                'midtrans_is_production' => $midtrans->is_production,

                'fonnte_token' => $fonnte->token,
                'fonnte_sender' => $fonnte->sender,

                'mail_host' => $mail->host,
                'mail_port' => $mail->port,
                'mail_username' => $mail->username,
                'mail_password' => $mail->password,
                'mail_encryption' => $mail->encryption,
                'mail_from_address' => $mail->from_address,
                'mail_from_name' => $mail->from_name,

                'site_name' => $site->site_name,
                'site_tagline' => $site->site_tagline,
                'site_description' => $site->site_description,
                'site_keywords' => $site->site_keywords,
                'site_url' => $site->site_url,
                'site_logo' => $site->site_logo,
                'site_logo_dark' => $site->site_logo_dark,
                'site_favicon' => $site->site_favicon,
                'og_image_url' => $site->og_image_url,
                'twitter_handle' => $site->twitter_handle,
                'support_email' => $site->support_email,
                'support_whatsapp' => $site->support_whatsapp,
                'telegram_group' => $site->telegram_group,
                'company_name' => $site->company_name,
                'company_address' => $site->company_address,

                'social_facebook' => $site->social_facebook,
                'social_instagram' => $site->social_instagram,
                'social_github' => $site->social_github,
                'social_linkedin' => $site->social_linkedin,
                'social_youtube' => $site->social_youtube,

                'is_maintenance_mode' => $site->is_maintenance_mode,
                'maintenance_message' => $site->maintenance_message,
            ]);
        } catch (\Exception $e) {
            // Silently fail if settings table not ready
        }
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Tabs::make('Settings Tabs')
                    ->tabs([
                        // ─── TAB 1: MIDTRANS ──────────────────────────────
                        Tabs\Tab::make('💳 Payment (Midtrans)')
                            ->schema([
                                Section::make('Midtrans Configuration')
                                    ->description('Configure your Midtrans payment gateway credentials. Credentials are encrypted in the database.')
                                    ->schema([
                                        TextInput::make('midtrans_merchant_id')
                                            ->label('Merchant ID')
                                            ->placeholder('G284917245')
                                            ->required(),
                                        TextInput::make('midtrans_client_key')
                                            ->label('Client Key')
                                            ->password()
                                            ->revealable()
                                            ->placeholder('Mid-client-xxxx'),
                                        TextInput::make('midtrans_server_key')
                                            ->label('Server Key')
                                            ->password()
                                            ->revealable()
                                            ->placeholder('Mid-server-xxxx'),
                                        Toggle::make('midtrans_is_production')
                                            ->label('Production Mode')
                                            ->helperText('Toggle ON for live transactions. Keep OFF for Sandbox testing.')
                                            ->columnSpanFull(),
                                    ])->columns(2),
                            ]),

                        // ─── TAB 2: FONNTE ────────────────────────────────
                        Tabs\Tab::make('📱 WhatsApp (Fonnte)')
                            ->schema([
                                Section::make('Fonnte Configuration')
                                    ->description('Configure the Fonnte API for automated WhatsApp notifications. Token is encrypted in the database.')
                                    ->schema([
                                        TextInput::make('fonnte_token')
                                            ->label('API Token')
                                            ->password()
                                            ->revealable()
                                            ->placeholder('GNPa6rHsx8qbmbu2fW6s')
                                            ->required(),
                                        TextInput::make('fonnte_sender')
                                            ->label('Sender Number')
                                            ->placeholder('6282120664105')
                                            ->helperText('WhatsApp number WITHOUT "+" prefix. Example: 6282120664105'),
                                    ])->columns(2),
                            ]),

                        // ─── TAB 3: MAIL ──────────────────────────────────
                        Tabs\Tab::make('📧 Email (SMTP)')
                            ->schema([
                                Section::make('Mail / SMTP Configuration')
                                    ->description('Configure SMTP credentials. For Gmail, use an App Password (not your regular password). Password is encrypted.')
                                    ->schema([
                                        TextInput::make('mail_host')
                                            ->label('SMTP Host')
                                            ->placeholder('smtp.gmail.com')
                                            ->required(),
                                        TextInput::make('mail_port')
                                            ->label('SMTP Port')
                                            ->placeholder('587')
                                            ->required(),
                                        TextInput::make('mail_encryption')
                                            ->label('Encryption')
                                            ->placeholder('tls'),
                                        TextInput::make('mail_username')
                                            ->label('Username / Email')
                                            ->placeholder('hello@3flo.net'),
                                        TextInput::make('mail_password')
                                            ->label('Password / App Password')
                                            ->password()
                                            ->revealable()
                                            ->placeholder('Gmail App Password'),
                                        TextInput::make('mail_from_address')
                                            ->label('From Address')
                                            ->email()
                                            ->placeholder('support@3flo.id'),
                                        TextInput::make('mail_from_name')
                                            ->label('From Name')
                                            ->placeholder('3Flo LicenseHub'),
                                    ])->columns(2),
                            ]),

                        // ─── TAB 4: SITE & SEO ────────────────────────────
                        Tabs\Tab::make('🌐 Site & SEO')
                            ->schema([
                                Section::make('Brand & General Info')
                                    ->description('Configure the global branding, company info, and SEO details.')
                                    ->schema([
                                        TextInput::make('site_name')
                                            ->label('Site Name')
                                            ->placeholder('3Flo LicenseHub')
                                            ->required(),
                                        TextInput::make('site_tagline')
                                            ->label('Tagline')
                                            ->placeholder('Professional License Management System'),
                                        TextInput::make('site_url')
                                            ->label('Frontend URL')
                                            ->placeholder('https://licensehub.3flo.id')
                                            ->url(),
                                        TextInput::make('company_name')
                                            ->label('Company Name')
                                            ->placeholder('3Flo'),
                                        TextInput::make('company_address')
                                            ->label('Company Address')
                                            ->placeholder('Jl. Contoh No. 123, Indonesia'),
                                        FileUpload::make('site_logo')
                                            ->label('Site Logo (Light Mode)')
                                            ->image()
                                            ->directory('site')
                                            ->maxSize(2048),
                                        FileUpload::make('site_logo_dark')
                                            ->label('Site Logo (Dark Mode)')
                                            ->image()
                                            ->directory('site')
                                            ->maxSize(2048),
                                        FileUpload::make('site_favicon')
                                            ->label('Favicon')
                                            ->image()
                                            ->directory('site')
                                            ->maxSize(1024),
                                    ])->columns(2),
                                Section::make('Contact & Support')
                                    ->schema([
                                        TextInput::make('support_email')
                                            ->label('Support Email')
                                            ->placeholder('support@3flo.id')
                                            ->email(),
                                        TextInput::make('support_whatsapp')
                                            ->label('Support WhatsApp')
                                            ->placeholder('6282120664105')
                                            ->helperText('Include country code, no + prefix. Used for support links.'),
                                        TextInput::make('telegram_group')
                                            ->label('Telegram Group')
                                            ->placeholder('https://t.me/yourgroup')
                                            ->url()
                                            ->helperText('Official telegram group link for support.'),
                                    ])->columns(2),
                                Section::make('SEO & Social Settings')
                                    ->schema([
                                        TextInput::make('site_description')
                                            ->label('Meta Description')
                                            ->placeholder('Platform manajemen lisensi software profesional. Kelola lisensi, aktivasi domain...')
                                            ->columnSpanFull(),
                                        TextInput::make('site_keywords')
                                            ->label('Meta Keywords')
                                            ->placeholder('license management, software license, lisensi software, midtrans, ...')
                                            ->helperText('Comma separated (e.g., license, software, management)')
                                            ->columnSpanFull(),
                                        FileUpload::make('og_image_url')
                                            ->label('OpenGraph Image')
                                            ->image()
                                            ->directory('site')
                                            ->helperText('Upload an image for social media cards (Facebook, WhatsApp, LinkedIn). Preferred size: 1200x630px'),
                                        TextInput::make('twitter_handle')
                                            ->label('Twitter / X Handle')
                                            ->placeholder('@3flo_id'),
                                    ])->columns(2),
                                Section::make('Social Links')
                                    ->schema([
                                        TextInput::make('social_facebook')
                                            ->label('Facebook URL')
                                            ->placeholder('https://facebook.com/3flo')
                                            ->url(),
                                        TextInput::make('social_instagram')
                                            ->label('Instagram URL')
                                            ->placeholder('https://instagram.com/3flo_id')
                                            ->url(),
                                        TextInput::make('social_github')
                                            ->label('GitHub URL')
                                            ->placeholder('https://github.com/3flo')
                                            ->url(),
                                        TextInput::make('social_linkedin')
                                            ->label('LinkedIn URL')
                                            ->placeholder('https://linkedin.com/company/3flo')
                                            ->url(),
                                        TextInput::make('social_youtube')
                                            ->label('YouTube URL')
                                            ->placeholder('https://youtube.com/c/3flo')
                                            ->url(),
                                    ])->columns(2),
                            ]),

                        // ─── TAB 5: MAINTENANCE ──────────────────────────
                        Tabs\Tab::make('🛠️ Maintenance')
                            ->schema([
                                Section::make('Maintenance Mode')
                                    ->description('When maintenance mode is active, the storefront and API will be disabled, but you can still access this admin panel.')
                                    ->schema([
                                        Toggle::make('is_maintenance_mode')
                                            ->label('Enable Maintenance Mode')
                                            ->helperText('Switch ON to disable public access.')
                                            ->columnSpanFull(),
                                        TextInput::make('maintenance_message')
                                            ->label('Maintenance Message')
                                            ->placeholder('Our servers are undergoing maintenance...')
                                            ->required()
                                            ->columnSpanFull(),
                                    ]),
                            ]),
                    ])->columnSpanFull(),
            ])
            ->statePath(''); // Bind directly to component properties
    }

    protected function getHeaderActions(): array
    {
        return [
            // ─── SAVE ─────────────────────────────────────────
            Action::make('save')
                ->label('Save Settings')
                ->icon('heroicon-o-check-circle')
                ->color('primary')
                ->action(function () {
                    $state = $this->form->getState();

                    // Midtrans
                    $midtrans = app(MidtransSettings::class);
                    $midtrans->merchant_id = $state['midtrans_merchant_id'] ?? $midtrans->merchant_id;
                    $midtrans->client_key = $state['midtrans_client_key'] ?? $midtrans->client_key;
                    $midtrans->server_key = $state['midtrans_server_key'] ?? $midtrans->server_key;
                    $midtrans->is_production = (bool) ($state['midtrans_is_production'] ?? false);
                    $midtrans->save();

                    // Fonnte
                    $fonnte = app(FonnteSettings::class);
                    $fonnte->token = $state['fonnte_token'] ?? $fonnte->token;
                    $fonnte->sender = $state['fonnte_sender'] ?? $fonnte->sender;
                    $fonnte->save();

                    // Mail
                    $mail = app(MailSettings::class);
                    $mail->host = $state['mail_host'] ?? $mail->host;
                    $mail->port = $state['mail_port'] ?? $mail->port;
                    $mail->username = $state['mail_username'] ?? $mail->username;
                    $mail->password = $state['mail_password'] ?? $mail->password;
                    $mail->encryption = $state['mail_encryption'] ?? $mail->encryption;
                    $mail->from_address = $state['mail_from_address'] ?? $mail->from_address;
                    $mail->from_name = $state['mail_from_name'] ?? $mail->from_name;
                    $mail->save();

                    // Site & SEO
                    $site = app(SiteSettings::class);
                    $site->site_name = $state['site_name'] ?? $site->site_name;
                    $site->site_tagline = $state['site_tagline'] ?? $site->site_tagline;
                    $site->site_description = $state['site_description'] ?? $site->site_description;
                    $site->site_keywords = $state['site_keywords'] ?? $site->site_keywords;
                    $site->site_url = $state['site_url'] ?? $site->site_url;

                    // FileUpload returns arrays in this context. Extract the string path:
                    $site->site_logo = is_array($state['site_logo'] ?? null) ? array_values($state['site_logo'])[0] ?? null : ($state['site_logo'] ?? $site->site_logo);
                    $site->site_logo_dark = is_array($state['site_logo_dark'] ?? null) ? array_values($state['site_logo_dark'])[0] ?? null : ($state['site_logo_dark'] ?? $site->site_logo_dark);
                    $site->site_favicon = is_array($state['site_favicon'] ?? null) ? array_values($state['site_favicon'])[0] ?? null : ($state['site_favicon'] ?? $site->site_favicon);
                    $site->og_image_url = is_array($state['og_image_url'] ?? null) ? array_values($state['og_image_url'])[0] ?? null : ($state['og_image_url'] ?? $site->og_image_url);

                    $site->twitter_handle = $state['twitter_handle'] ?? $site->twitter_handle;
                    $site->support_email = $state['support_email'] ?? $site->support_email;
                    $site->support_whatsapp = $state['support_whatsapp'] ?? $site->support_whatsapp;
                    $site->telegram_group = $state['telegram_group'] ?? $site->telegram_group;
                    $site->company_name = $state['company_name'] ?? $site->company_name;
                    $site->company_address = $state['company_address'] ?? $site->company_address;

                    $site->social_facebook = $state['social_facebook'] ?? $site->social_facebook;
                    $site->social_instagram = $state['social_instagram'] ?? $site->social_instagram;
                    $site->social_github = $state['social_github'] ?? $site->social_github;
                    $site->social_linkedin = $state['social_linkedin'] ?? $site->social_linkedin;
                    $site->social_youtube = $state['social_youtube'] ?? $site->social_youtube;

                    $site->is_maintenance_mode = (bool) ($state['is_maintenance_mode'] ?? false);
                    $site->maintenance_message = $state['maintenance_message'] ?? $site->maintenance_message;

                    $site->save();

                    // Clear settings cache so overrides pick up new values
                    app()->forgetInstance(MidtransSettings::class);
                    app()->forgetInstance(FonnteSettings::class);
                    app()->forgetInstance(MailSettings::class);
                    app()->forgetInstance(SiteSettings::class);

                    Notification::make()
                        ->title('✅ Settings saved successfully!')
                        ->success()
                        ->send();
                }),

            // ─── TEST WHATSAPP ────────────────────────────────
            Action::make('testWhatsApp')
                ->label('Test WhatsApp')
                ->icon('heroicon-o-chat-bubble-left-right')
                ->color('success')
                ->requiresConfirmation()
                ->modalHeading('Send WhatsApp Test')
                ->modalDescription('This will send a test message to the Sender Number saved in Fonnte settings.')
                ->action(function () {
                    $fonnte = app(FonnteSettings::class);

                    if (empty($fonnte->token) || empty($fonnte->sender)) {
                        Notification::make()
                            ->title('Fonnte not configured!')
                            ->body('Please save Fonnte Token and Sender Number first.')
                            ->danger()->send();

                        return;
                    }

                    $response = Http::withHeaders([
                        'Authorization' => $fonnte->token,
                    ])->post('https://api.fonnte.com/send', [
                        'target' => $fonnte->sender,
                        'message' => '✅ *LicenseHub Test*'."\n\n".'WhatsApp notification is working correctly!'."\n".'Sent at: '.now()->toDateTimeString(),
                        'countryCode' => '62',
                    ]);

                    if ($response->successful() && $response->json('status') == true) {
                        Notification::make()
                            ->title('✅ WhatsApp sent!')
                            ->body('Check your number: '.$fonnte->sender)
                            ->success()->send();
                    } else {
                        Notification::make()
                            ->title('❌ WhatsApp failed!')
                            ->body($response->json('reason') ?? $response->body())
                            ->danger()->persistent()->send();
                    }
                }),

            // ─── TEST EMAIL ───────────────────────────────────
            Action::make('testEmail')
                ->label('Test Email')
                ->icon('heroicon-o-envelope')
                ->color('warning')
                ->modalHeading('Send Test Email')
                ->modalDescription('Enter a target email address. Uses your current saved SMTP settings.')
                ->form([
                    Radio::make('delivery_method')
                        ->label('Metode Pengiriman')
                        ->options([
                            'log' => '📝 Simpan ke Log (Cek storage/logs/laravel.log)',
                            'smtp' => '🚀 Kirim ke Email Tujuan (Gunakan SMTP)',
                        ])
                        ->default('smtp')
                        ->required(),
                    TextInput::make('test_to_address')
                        ->label('Kirim test email ke')
                        ->email()
                        ->placeholder('hello@3flo.net')
                        ->required()
                        ->hidden(fn ($get) => $get('delivery_method') === 'log'),
                ])
                ->action(function (array $data) {
                    $mailSettings = app(MailSettings::class);
                    $driver = $data['delivery_method']; // Use choice from modal
                    $toAddress = $data['test_to_address'] ?? $mailSettings->from_address;

                    if ($driver === 'smtp' && empty($mailSettings->host)) {
                        Notification::make()
                            ->title('Mail not configured!')
                            ->body('Please save your SMTP settings first.')
                            ->danger()->send();

                        return;
                    }

                    config([
                        'mail.default' => $driver,
                        'mail.mailers.smtp.host' => $mailSettings->host,
                        'mail.mailers.smtp.port' => (int) $mailSettings->port,
                        'mail.mailers.smtp.username' => $mailSettings->username ?: null,
                        'mail.mailers.smtp.password' => $mailSettings->password ?: null,
                        'mail.mailers.smtp.encryption' => $mailSettings->encryption ?: null,
                        'mail.from.address' => $mailSettings->from_address,
                        'mail.from.name' => $mailSettings->from_name,
                    ]);

                    app()->forgetInstance('mailer');

                    try {
                        Mail::raw(
                            '✅ LicenseHub Mail Test ('.strtoupper($driver).")\n\nYour email configuration is working!\nDriver: {$driver}\nSent: ".now()->toDateTimeString(),
                            function ($message) use ($toAddress, $mailSettings) {
                                $message->to($toAddress)
                                    ->from($mailSettings->from_address, $mailSettings->from_name)
                                    ->subject('[LicenseHub] Mail Test - '.now()->toDateTimeString());
                            }
                        );

                        $msgBody = ($driver === 'log')
                            ? 'Email saved to storage/logs/laravel.log'
                            : 'Check inbox: '.$toAddress;

                        Notification::make()
                            ->title('✅ Test email processed!')
                            ->body($msgBody)
                            ->success()->send();
                    } catch (\Exception $e) {

                        Notification::make()
                            ->title('❌ Email failed!')
                            ->body($e->getMessage())
                            ->danger()->persistent()->send();
                    }
                }),
        ];
    }
}
