import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, ArrowLeft } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const ContractDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchContractDetails();
        fetchTransactions();
    }, [id]);

    const fetchContractDetails = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/contracts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setContract(data);
        } catch (error) {
            console.error('Error fetching contract details:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/contracts/${id}/transactions`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const generatePDF = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/contracts/${id}/pdf`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `contrat-${contract.contract_number}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    if (!contract) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center space-x-4 mb-6">
                <Button
                    variant="outline"
                    onClick={() => navigate('/client/contracts')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>
                <h1 className="text-2xl font-bold">Détails du Contrat</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du Contrat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Numéro de contrat</h3>
                                <p>{contract.contract_number}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Type</h3>
                                <p>{contract.type === 'sale' ? 'Vente' : 'Location'}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Propriété</h3>
                                <p>{contract.property.title}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Dates</h3>
                                <p>Début: {format(new Date(contract.start_date), 'dd MMMM yyyy', { locale: fr })}</p>
                                {contract.end_date && (
                                    <p>Fin: {format(new Date(contract.end_date), 'dd MMMM yyyy', { locale: fr })}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold">Prix</h3>
                                <p>{contract.price} €</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Modalités de paiement</h3>
                                <p>{contract.payment_terms}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Statut</h3>
                                <Badge className={
                                    contract.status === 'active' ? 'bg-green-500' :
                                    contract.status === 'terminated' ? 'bg-red-500' :
                                    'bg-gray-500'
                                }>
                                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Transactions</CardTitle>
                        <Button onClick={generatePDF}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger PDF
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Montant</TableHead>
                                    <TableHead>Méthode</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>
                                            {format(new Date(transaction.payment_date), 'dd/MM/yyyy')}
                                        </TableCell>
                                        <TableCell>{transaction.amount} €</TableCell>
                                        <TableCell>{transaction.payment_method}</TableCell>
                                        <TableCell>
                                            <Badge className={
                                                transaction.status === 'completed' ? 'bg-green-500' :
                                                transaction.status === 'pending' ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }>
                                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ContractDetails; 