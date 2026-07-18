import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts } from '@/data/products-repository';
import { getOrders } from '@/data/orders-repository';
import { formatPrice } from '@/lib/utils';

export default async function OverviewPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);

  const published = products.filter((p) => p.status === 'published').length;
  const newOrders = orders.filter((o) => o.status === 'new').length;
  const revenueCents = orders
    .filter((o) => o.status === 'paid' || o.status === 'fulfilled')
    .reduce((sum, o) => sum + o.total_cents, 0);

  const stats = [
    { label: 'Products', value: String(products.length), sub: `${published} published` },
    { label: 'Orders', value: String(orders.length), sub: `${newOrders} new` },
    { label: 'Revenue', value: formatPrice(revenueCents), sub: 'paid + fulfilled' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-heading text-2xl font-bold tracking-tight">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6">
              <p className="text-muted text-sm font-medium">{s.label}</p>
              <p className="text-heading mt-2 text-3xl font-bold">{s.value}</p>
              <p className="text-muted mt-1 text-xs">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="divide-border divide-y">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-heading font-medium">{o.customer_name}</span>
                <span className="text-muted">{formatPrice(o.total_cents)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
