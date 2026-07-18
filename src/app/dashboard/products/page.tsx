import { Card } from '@/components/ui/card';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { getProducts } from '@/data/products-repository';
import { formatPrice } from '@/lib/utils';
import type { ProductStatus } from '@/types/database';

const statusTone: Record<ProductStatus, BadgeTone> = {
  published: 'green',
  draft: 'amber',
  archived: 'neutral',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <h1 className="text-heading text-2xl font-bold tracking-tight">Products</h1>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-border text-muted border-b text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="text-heading px-6 py-3 font-medium">{p.name}</td>
                <td className="text-muted px-6 py-3">{formatPrice(p.price_cents)}</td>
                <td className="px-6 py-3">
                  <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                </td>
                <td className="text-muted px-6 py-3">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
