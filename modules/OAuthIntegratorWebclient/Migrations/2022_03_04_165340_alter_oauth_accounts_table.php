<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

class AlterOauthAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $prefix = Capsule::connection()->getTablePrefix();
        Capsule::connection()->statement("ALTER TABLE {$prefix}oauth_accounts MODIFY RefreshToken text");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $prefix = Capsule::connection()->getTablePrefix();
        Capsule::connection()->statement("ALTER TABLE {$prefix}oauth_accounts MODIFY RefreshToken varchar(255)");
    }
}
