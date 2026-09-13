<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'gender' => $this->gender,
            'price' => $this->price,
            'active' => $this->active,

            'image' => $this->image,
            'image_url' => $this->image
                ? Storage::disk('public')->url($this->image)
                : null,

            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
            ],

            'sizes' => $this->sizes->map(function ($size) {
                return [
                    'id' => $size->id,
                    'name' => $size->name,
                ];
            }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
