<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SizeController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('products', ProductController::class)
        ->except(['index', 'show']);

    Route::apiResource('categories', CategoryController::class)
        ->except(['index', 'show']);

    Route::apiResource('sizes', SizeController::class)
        ->except(['index', 'show']);
});