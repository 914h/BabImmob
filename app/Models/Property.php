<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'title',
        'description',
        'price',
        'address',
        'city',
        'surface',
        'rooms',
        'type',
        'status',
        'images',
    ];

    protected $casts = [
        'price' => 'float',
        'surface' => 'float',
        'rooms' => 'integer',
        'images' => 'array',
    ];

    public function owner()
    {
        return $this->belongsTo(\App\Models\Owner::class, 'owner_id');
    }

    public function getMainImageAttribute()
    {
        return is_array($this->images) && count($this->images) > 0 ? $this->images[0] : null;
    }
} 