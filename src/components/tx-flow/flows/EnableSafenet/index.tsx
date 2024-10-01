import TxLayout from '@/components/tx-flow/common/TxLayout'
import { ReviewEnableSafenet } from './ReviewEnableSafenet'

// TODO: This can possibly be combined with the remove module type
export type EnableSafenetFlowProps = {
  guardAddress: string
}

const EnableSafenetFlow = ({ guardAddress }: EnableSafenetFlowProps) => {
  return (
    <TxLayout title="Confirm transaction" subtitle="Enable SafeNet">
      <ReviewEnableSafenet params={{ guardAddress }} />
    </TxLayout>
  )
}

export { EnableSafenetFlow }
