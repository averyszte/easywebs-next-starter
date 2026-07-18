import { Card } from '@/components/ui/card';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { getOrders } from '@/data/orders-repository';
import { formatPrice } from '@/lib/utils';
import type { OrderStatus } from '@/types/database';

const statusTone: Record<OrderStatus, BadgeTone> = {
  new: 'blue',
  paid: 'green',
  fulfilled: 'neutral',
  cancelled: 'red',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-heading text-2xl font-bold tracking-tight">Orders</h1>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-border text-muted border-b text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-6 py-3">
                  <span className="text-heading font-medium">{o.customer_name}</span>
                  <span className="text-muted block text-xs">{o.customer_email}</span>
                </td>
                <td className="text-muted px-6 py-3">{formatPrice(o.total_cents)}</td>
                <td className="px-6 py-3">
                  <Badge tone={statusTone[o.status]}>{o.status}</Badge>
                </td>
                <td className="text-muted px-6 py-3 capitalize">{o.source}</td>
                <td className="text-muted px-6 py-3">{formatDate(o.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
