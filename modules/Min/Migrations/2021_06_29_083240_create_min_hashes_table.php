<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateMinHashesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Capsule::schema()->create('core_min_hashes', function (Blueprint $table) {
            $table->increments('Id');
            $table->string('HashId', 32)->default('');
            $table->bigInteger('UserId')->nullable();
            $table->string('Hash', 20)->default('');
            $table->text('Data');
            $table->integer('ExpireDate')->default(0)->nullable();
            $table->timestamp(\Aurora\System\Classes\Model::CREATED_AT)->nullable();
            $table->timestamp(\Aurora\System\Classes\Model::UPDATED_AT)->nullable();
            $table->index('Hash', 'min_hash_index');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Capsule::schema()->dropIfExists('core_min_hashes');
    }
}
