<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TinyMceFileUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_admin_uploads_pdf_under_readable_name(): void
    {
        $user = User::factory()->create()->assignRole(User::ROLE_ADMIN);
        $pdf = UploadedFile::fake()->create('Ordin nr 619 din 07.09.2010.pdf', 100, 'application/pdf');

        $response = $this->actingAs($user)->postJson('/admin/tinymce/upload-file', ['file' => $pdf]);

        $response->assertOk();
        $this->assertMatchesRegularExpression(
            '#/storage/documents/ordin-nr-619-din-07092010-\d{14}\.pdf$#',
            $response->json('location')
        );
        $this->assertCount(1, Storage::disk('public')->files('documents'));
    }

    public function test_guest_cannot_upload(): void
    {
        $pdf = UploadedFile::fake()->create('a.pdf', 10, 'application/pdf');

        $this->postJson('/admin/tinymce/upload-file', ['file' => $pdf])->assertUnauthorized();
    }

    public function test_non_pdf_is_rejected(): void
    {
        $user = User::factory()->create()->assignRole(User::ROLE_ADMIN);
        $file = UploadedFile::fake()->create('script.php', 10, 'text/x-php');

        $this->actingAs($user)->postJson('/admin/tinymce/upload-file', ['file' => $file])
            ->assertUnprocessable();
    }
}
