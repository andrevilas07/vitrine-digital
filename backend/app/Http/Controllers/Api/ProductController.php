<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'sizes']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        if ($request->filled('active')) {
            $query->where('active', $request->boolean('active'));
        }

        if ($request->filled('size_id')) {
            $query->whereHas('sizes', function ($q) use ($request) {
                $q->where('sizes.id', $request->size_id);
            });
        }

        $products = $query
            ->orderBy('name')
            ->get();

        return ProductResource::collection($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'gender' => ['required', 'in:M,F,U'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'active' => ['nullable', 'boolean'],

            'sizes' => ['nullable', 'array'],
            'sizes.*' => ['exists:sizes,id'],
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'gender' => $validated['gender'],
            'price' => $validated['price'],
            'image' => $imagePath,
            'active' => $validated['active'] ?? true,
        ]);

        if (!empty($validated['sizes'])) {
            $product->sizes()->sync($validated['sizes']);
        }

        return (new ProductResource(
            $product->load(['category', 'sizes'])
        ))->response()->setStatusCode(201);
    }

    public function show(Product $product)
    {
        return new ProductResource(
            $product->load(['category', 'sizes'])
        );
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'gender' => ['required', 'in:M,F,U'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'active' => ['nullable', 'boolean'],

            'sizes' => ['nullable', 'array'],
            'sizes.*' => ['exists:sizes,id'],
        ]);

        $imagePath = $product->image;

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'gender' => $validated['gender'],
            'price' => $validated['price'],
            'image' => $imagePath,
            'active' => $validated['active'] ?? true,
        ]);

        if (array_key_exists('sizes', $validated)) {
            $product->sizes()->sync($validated['sizes'] ?? []);
        }

        return new ProductResource(
            $product->load(['category', 'sizes'])
        );
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(null, 204);
    }
}