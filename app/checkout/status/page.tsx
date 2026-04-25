'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface TransactionData {
  payment_type: string;
  amount: string;
  transaction_id: string;
  status: string;
  payerDetails: { name: string; email: string };
  internalDetails: { date_payment: string; total_value: string };
}

const TRANSACTION_STATUS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  '1':   { label: '¡Pago Aprobado!',    color: 'text-green-500',  icon: <CheckCircle  className="h-20 w-20 text-green-500  mx-auto mb-4" /> },
  '9':   { label: 'Pago Rechazado',     color: 'text-red-500',    icon: <XCircle      className="h-20 w-20 text-red-500    mx-auto mb-4" /> },
  '11':  { label: 'Pago Pendiente',     color: 'text-yellow-500', icon: <Clock        className="h-20 w-20 text-yellow-500 mx-auto mb-4" /> },
  '17':  { label: 'Pago Anulado',       color: 'text-orange-500', icon: <AlertCircle  className="h-20 w-20 text-orange-500 mx-auto mb-4" /> },
  '999': { label: 'Pago Fallido',       color: 'text-red-500',    icon: <XCircle      className="h-20 w-20 text-red-500    mx-auto mb-4" /> },
  '109': { label: 'Pago PSE Fallido',   color: 'text-red-500',    icon: <XCircle      className="h-20 w-20 text-red-500    mx-auto mb-4" /> },
};

const PAYMENT_TYPE: Record<string, string> = {
  cash: 'Efectivo',
  bank:  'PSE',
  card: 'T. Crédito',
};

function formatDate(raw: string): string {
  const d = new Date(raw.replace(' ', 'T'));
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const HH   = String(d.getHours()).padStart(2, '0');
  const min  = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${HH}:${min}`;
}

function formatCurrency(value: string): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(value));
}

export default function CheckoutStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [txData, setTxData] = useState<TransactionData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const sessionId    = searchParams?.get('session_id');
  const transactionId = searchParams?.get('transactionId');
  const webcheckout  = searchParams?.get('webcheckout');

  useEffect(() => {
    if (transactionId) {
      fetch('/api/megapagos/transaction-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status === 200) {
            setTxData(result.data);
          } else {
            setFetchError(result.message || 'Error al consultar la transacción');
          }
        })
        .catch(() => setFetchError('Error al consultar la transacción'))
        .finally(() => setLoading(false));
    } else if (sessionId || webcheckout) {
      setTimeout(() => setLoading(false), 2000);
    } else {
      setLoading(false);
    }
  }, [sessionId, transactionId, webcheckout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center body-gradient">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-white">Procesando tu pago...</p>
        </div>
      </div>
    );
  }

  const statusKey  = txData?.status ?? '';
  const statusInfo = TRANSACTION_STATUS[statusKey];
  const isApproved = statusKey === '1';

  return (
    <div className="min-h-screen body-gradient flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        <div className="mb-6">
          {fetchError ? (
            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
          ) : (
            statusInfo?.icon ?? <Package className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          )}

          <h1 className={`text-3xl font-bold mb-2 ${fetchError ? 'text-red-500' : (statusInfo?.color ?? 'text-gray-900')}`}>
            {fetchError ? 'Error' : (statusInfo?.label ?? 'Estado desconocido')}
          </h1>

          {fetchError && (
            <p className="text-gray-500 text-sm">{fetchError}</p>
          )}
        </div>

        {txData && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left space-y-3">
            <InfoRow label="Método de pago"    value={PAYMENT_TYPE[txData.payment_type]} />
            <InfoRow label="Nombre del pagador" value={txData.payerDetails.name} />
            <InfoRow label="Email pagador"      value={txData.payerDetails.email} />
            <InfoRow label="Valor pagado"       value={formatCurrency(txData.internalDetails.total_value)} />
            <InfoRow label="Fecha de pago"      value={formatDate(txData.internalDetails.date_payment)} />
            <InfoRow label="ID transacción"     value={txData.transaction_id} />
          </div>
        )}

        <div className="space-y-3">
          {isApproved && (
            <Button
              onClick={() => router.push('/orders')}
              className="w-full bg-primary hover:bg-primary-hover py-6 text-lg"
            >
              Ver Mis Órdenes
            </Button>
          )}
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full py-6 text-lg"
          >
            Continuar Comprando
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`text-gray-900 font-medium text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  );
}
