<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    use HasFactory;

    protected $table = 'contrats';

    protected $fillable = [
        'property_id',
        'owner_id',
        'client_id',
        'agent_id',
        'type',
        'start_date',
        'end_date',
        'total_amount',
        'conditions',
        'description',
        'contract_number',
        'status',
        'document_path',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id');
    }

    public function owner()
    {
        return $this->belongsTo(Owner::class, 'owner_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'contrat_id');
    }
} 