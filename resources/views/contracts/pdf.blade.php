<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contrat {{ $contract->contract_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .contract-number {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            margin-bottom: 10px;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
            border-top: 1px solid #000;
            padding-top: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>CONTRAT {{ strtoupper($contract->type === 'sale' ? 'DE VENTE' : 'DE LOCATION') }}</h1>
        <div class="contract-number">N° {{ $contract->contract_number }}</div>
    </div>

    <div class="section">
        <div class="section-title">ENTRE LES SOUSSIGNÉS :</div>
        <p>
            <strong>Le Propriétaire :</strong><br>
            {{ $contract->owner->name }}<br>
            {{ $contract->owner->email }}
        </p>
        <p>
            <strong>Le {{ $contract->type === 'sale' ? 'Vendeur' : 'Locataire' }} :</strong><br>
            {{ $contract->client->name }}<br>
            {{ $contract->client->email }}
        </p>
    </div>

    <div class="section">
        <div class="section-title">PROPRIÉTÉ CONCERNÉE :</div>
        <p>
            {{ $contract->property->title }}<br>
            {{ $contract->property->address }}<br>
            {{ $contract->property->city }}, {{ $contract->property->postal_code }}
        </p>
    </div>

    <div class="section">
        <div class="section-title">CONDITIONS DU CONTRAT :</div>
        <p>
            <strong>Type :</strong> {{ $contract->type === 'sale' ? 'Vente' : 'Location' }}<br>
            <strong>Date de début :</strong> {{ $contract->start_date->format('d/m/Y') }}<br>
            @if($contract->end_date)
            <strong>Date de fin :</strong> {{ $contract->end_date->format('d/m/Y') }}<br>
            @endif
            <strong>Prix :</strong> {{ number_format($contract->price, 2) }} €<br>
            <strong>Modalités de paiement :</strong> {{ $contract->payment_terms }}
        </p>
    </div>

    @if($contract->description)
    <div class="section">
        <div class="section-title">DESCRIPTION SUPPLÉMENTAIRE :</div>
        <p>{{ $contract->description }}</p>
    </div>
    @endif

    <div class="signature-section">
        <div class="signature-box">
            <p>Le Propriétaire</p>
        </div>
        <div class="signature-box">
            <p>Le {{ $contract->type === 'sale' ? 'Vendeur' : 'Locataire' }}</p>
        </div>
    </div>

    <div style="margin-top: 50px; text-align: center; font-size: 12px;">
        <p>Document généré le {{ now()->format('d/m/Y') }}</p>
    </div>
</body>
</html> 