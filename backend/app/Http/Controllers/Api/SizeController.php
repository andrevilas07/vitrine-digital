<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Size;
use App\Http\Resources\SizeResource;
use Illuminate\Http\Request;

class SizeController extends Controller
{
    public function index()
    {
        $sizes = Size::orderBy('name')->get();
        return SizeResource::collection($sizes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:20'],
        ]);

        $size = Size::create($validated);

        return (new SizeResource($size))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Size $size)
    {
        return new SizeResource($size);
    }

    public function update(Request $request, Size $size)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:20'],
        ]);

        $size->update($validated);

        return new SizeResource($size);

    }

    public function destroy(Size $size)
    {
        $size->delete();

        return response()->json(null, 204);
    }
}