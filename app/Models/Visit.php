<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'client_id',
        'agent_id',
        'visit_date',
        'visit_time',
        'status', // 'pending', 'confirmed', 'cancelled', 'completed'
        'notes',
    ];

    protected $casts = [
        'visit_date' => 'date',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
} 