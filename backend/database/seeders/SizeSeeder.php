<?php

namespace Database\Seeders;

use App\Models\Size;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sizes = [
            'PP',
            'P',
            'M',
            'G',
            'GG',
            '36',
            '38',
            '40',
            '42',
            '44',
            '46',
        ];


        foreach ($sizes as $size) {
            Size::create([
                'name' => $size
            ]);
        }
    }
}
