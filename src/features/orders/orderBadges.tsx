import { Badge } from '../../components/ui/Badge';
import type { OrderStatus, PaymentStatus } from '../../types';

export function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'DELIVERED':
      return <Badge variant="success">Delivered</Badge>;
    case 'SHIPPED':
      return <Badge variant="info">Shipped</Badge>;
    case 'PROCESSING':
    case 'CONFIRMED':
      return <Badge variant="accent">{status}</Badge>;
    case 'CANCELLED':
      return <Badge variant="danger">Cancelled</Badge>;
    case 'PENDING':
    default:
      return <Badge variant="warning">Pending</Badge>;
  }
}

export function getPaymentStatusBadge(status: PaymentStatus) {
  switch (status) {
    case 'PAID':
      return <Badge variant="success">Paid</Badge>;
    case 'REFUNDED':
      return <Badge variant="outline">Refunded</Badge>;
    case 'FAILED':
      return <Badge variant="danger">Failed</Badge>;
    case 'PENDING':
    default:
      return <Badge variant="warning">Payment Pending</Badge>;
  }
}
