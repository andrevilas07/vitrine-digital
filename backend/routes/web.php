<?php

use App\Http\Controllers\ProductImageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Vitrine Digital API']);
});

Route::get('/media/products/{filename}', [ProductImageController::class, 'show']);
