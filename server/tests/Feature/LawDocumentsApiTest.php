<?php

namespace Tests\Feature;

use App\Models\LawDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LawDocumentsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_lists_only_active_documents_in_order(): void
    {
        // The seed migration already inserted the Legislație acts.
        LawDocument::query()->delete();

        LawDocument::create(['title_ro' => 'Second', 'url' => 'https://legis.md/b', 'sort_order' => 2]);
        LawDocument::create(['title_ro' => 'First', 'file_path' => 'legislatie/a.pdf', 'sort_order' => 1]);
        LawDocument::create(['title_ro' => 'Hidden', 'url' => 'https://legis.md/c', 'sort_order' => 0, 'is_active' => false]);

        $this->getJson('/api/law-documents')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.title_ro', 'First')
            ->assertJsonPath('1.title_ro', 'Second');
    }

    public function test_admin_pages_render(): void
    {
        $this->actingAs(User::factory()->create()->assignRole(User::ROLE_ADMIN));

        $this->get('/admin/law-documents')->assertOk()->assertSee('Legea nr. 264');
        $this->get('/admin/law-documents/create')->assertOk();
        $this->get('/admin/law-documents/'.LawDocument::first()->id.'/edit')->assertOk();
    }

    public function test_seed_publishes_only_acts_with_a_source(): void
    {
        $this->assertSame(10, LawDocument::count());
        $this->assertSame(8, LawDocument::where('is_active', true)->count());
        $this->assertSame(0, LawDocument::where('is_active', true)->whereNull('url')->whereNull('file_path')->count());
    }
}
