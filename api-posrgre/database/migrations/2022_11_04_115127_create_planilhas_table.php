<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('planilha', function (Blueprint $table) {
            // $table->increments('id');
            $table->string('dados1');
            $table->string('dados2');
            // $table->timestamps();
        });
    }
};
