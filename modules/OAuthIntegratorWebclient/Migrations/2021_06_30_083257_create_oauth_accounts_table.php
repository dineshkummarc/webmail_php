<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

class CreateOauthAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Capsule::schema()->create('oauth_accounts', function (Blueprint $table) {
            $table->id('Id');
            $table->integer('IdUser')->default(0);
            $table->string('IdSocial')->default('');
            $table->string('Type')->default('');
            $table->string('Name')->default('');
            $table->string('Email')->default('');
            $table->text('AccessToken');
            $table->string('RefreshToken')->default('');
            $table->string('Scopes')->default('');
            $table->boolean('Disabled')->default(false);
            $table->string('AccountType')->default('oauth');
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
        Capsule::schema()->dropIfExists('oauth_accounts');
    }
}
