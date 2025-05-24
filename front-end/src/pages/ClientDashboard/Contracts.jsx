import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const Contracts = () => {
    const [contracts, setContracts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/contracts`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setContracts(data);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            active: 'bg-green-500',
            terminated: 'bg-red-500',
            archived: 'bg-gray-500'
        };

        return (
            <Badge className={`${statusColors[status]} text-white`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Mes Contrats</h1>
                <Button onClick={() => navigate('/client/contracts/new')}>
                    Nouveau Contrat
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des Contrats</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Propriété</TableHead>
                                <TableHead>Date de début</TableHead>
                                <TableHead>Prix</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contracts.map((contract) => (
                                <TableRow key={contract.id}>
                                    <TableCell>{contract.contract_number}</TableCell>
                                    <TableCell>
                                        {contract.type === 'sale' ? 'Vente' : 'Location'}
                                    </TableCell>
                                    <TableCell>{contract.property.title}</TableCell>
                                    <TableCell>
                                        {format(new Date(contract.start_date), 'dd MMMM yyyy', { locale: fr })}
                                    </TableCell>
                                    <TableCell>{contract.price} €</TableCell>
                                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/client/contracts/${contract.id}`)}
                                        >
                                            Voir détails
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Contracts; 