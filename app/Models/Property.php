<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'type',
        'title',
        'description',
        'address',
        'city',
        'surface',
        'rooms',
        'price',
        'status',
        'images'
    ];

    protected $casts = [
        'images' => 'array',
        'surface' => 'decimal:2',
        'price' => 'decimal:2',
        'rooms' => 'integer'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function photos()
    {
        return $this->hasMany(PropertyPhoto::class);
    }
} 