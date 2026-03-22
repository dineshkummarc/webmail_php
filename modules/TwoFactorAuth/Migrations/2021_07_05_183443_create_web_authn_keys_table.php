<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

class CreateWebAuthnKeysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Capsule::schema()->create('security_web_authn_keys', function (Blueprint $table) {
            $table->id('Id');
            $table->bigInteger('UserId')->default(0);
            $table->string('Name')->default('');
            $table->text('KeyData');
            $table->integer('CreationDateTime')->default(0);
            $table->integer('LastUsageDateTime')->default(0);
            $table->timestamp(\Aurora\System\Classes\Model::CREATED_AT)->nullable();
            $table->timestamp(\Aurora\System\Classes\Model::UPDATED_AT)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Capsule::schema()->dropIfExists('security_web_authn_keys');
    }
}
