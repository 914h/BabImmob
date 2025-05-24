<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'owner_id',
        'client_id',
        'agent_id',
        'type', // 'sale' or 'rental'
        'start_date',
        'end_date',
        'signature_date',
        'total_amount',
        'conditions',
        'status', // 'active', 'terminated', 'archived'
        'contract_number',
        'description',
        'document_path',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'signature_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function owner()
    {
        return $this->belongsTo(Owner::class, 'owner_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function agent()
    {
        return $this->hasMany(Transaction::class);
    }
} 