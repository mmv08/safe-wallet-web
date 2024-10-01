import { useContext, useEffect } from 'react'
import { Typography } from '@mui/material'
import SignOrExecuteForm from '@/components/tx/SignOrExecuteForm'
import EthHashInfo from '@/components/common/EthHashInfo'
import { Errors, logError } from '@/services/exceptions'
import { createEnableGuardTx } from '@/services/tx/tx-sender'
import { type EnableSafenetFlowProps } from '.'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'

export const ReviewEnableSafenet = ({ params }: { params: EnableSafenetFlowProps }) => {
  const { setSafeTx, safeTxError, setSafeTxError } = useContext(SafeTxContext)

  useEffect(() => {
    createEnableGuardTx(params.guardAddress).then(setSafeTx).catch(setSafeTxError)
  }, [setSafeTx, setSafeTxError, params.guardAddress])

  useEffect(() => {
    if (safeTxError) {
      logError(Errors._807, safeTxError.message)
    }
  }, [safeTxError])

  return (
    <SignOrExecuteForm
      onSubmit={() => {
        console.log('register safenet')
      }}
    >
      <Typography sx={({ palette }) => ({ color: palette.primary.light })}>Transaction guard</Typography>

      <EthHashInfo address={params.guardAddress} showCopyButton hasExplorer shortAddress={false} />

      <Typography my={2}>
        Once the transaction guard has been enabled, SafeNet will be enabled for your Safe.
      </Typography>
    </SignOrExecuteForm>
  )
}
