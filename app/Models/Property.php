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

    // Override the setImagesAttribute to ensure proper JSON encoding
    public function setImagesAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['images'] = json_encode($value);
        } else {
            $this->attributes['images'] = $value;
        }
    }

    // Override the getImagesAttribute to ensure proper JSON decoding
    public function getImagesAttribute($value)
    {
        if (is_null($value)) {
            return [];
        }

        if (is_string($value)) {
            try {
                $decoded = json_decode($value, true);
                return is_array($decoded) ? $decoded : [$value];
            } catch (\Exception $e) {
                return [$value];
            }
        }

        return $value;
    }
} 