<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

class AlterUsedDevicesTableAddDeviceCustomNameColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Capsule::schema()->table('security_used_devices', function (Blueprint $table) {
            $table->string('DeviceCustomName', 255)->default('')->after('DeviceName');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Capsule::schema()->table('security_used_devices', function (Blueprint $table) {
            $table->dropColumn('DeviceCustomName');
        });
    }
}
