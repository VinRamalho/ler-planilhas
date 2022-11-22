<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TableController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


// Route::get('/users', [UserController::class, '@getAllStudents']);

Route::get('/getall', [TableController::class, 'getAll']);

Route::get('/fruta', [TableController::class, 'create']);

Route::get('/frutabackup', [TableController::class, 'backup']);

Route::get('/file', [TableController::class, 'file']);

Route::get('/deleteFile', [TableController::class, 'deleteFile']);


