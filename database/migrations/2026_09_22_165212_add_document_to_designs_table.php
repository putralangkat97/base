<?php

use App\Support\Vowly\DesignDocumentSchema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('designs', function (Blueprint $table) {
            $table->json('document')->nullable()->after('archived_at');
        });

        DB::table('designs')
            ->whereNull('document')
            ->update(['document' => json_encode(DesignDocumentSchema::empty(), JSON_THROW_ON_ERROR)]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('designs', function (Blueprint $table) {
            $table->dropColumn('document');
        });
    }
};
