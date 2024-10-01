import type { NextPage } from 'next'
import Head from 'next/head'
import { Grid, Paper, SvgIcon, Tooltip, Typography } from '@mui/material'
import InfoIcon from '@/public/images/notifications/info.svg'

import SettingsHeader from '@/components/settings/SettingsHeader'
import useSafeInfo from '@/hooks/useSafeInfo'
import { hasSafeFeature } from '@/utils/safe-versions'
import { SAFE_FEATURES } from '@safe-global/protocol-kit/dist/src/utils'
import { SAFENET_GUARD_ADDRESS } from '@/config/constants'
import { sameAddress } from '@/utils/addresses'
import { useContext, useEffect } from 'react'
import { TxModalContext } from '@/components/tx-flow'
import { EnableSafenetFlow } from '@/components/tx-flow/flows/EnableSafenet'
import { useGetSafeNetOffchainStatusQuery, useRegisterSafeNetMutation } from '@/store/safenet'

const Loading = () => {
  return <div>Loading...</div>
}

const SafeNetPage: NextPage = () => {
  const { safe, safeLoaded } = useSafeInfo()
  const { setTxFlow } = useContext(TxModalContext)
  const {
    data: safeNetOffchainStatus,
    isLoading: safeNetOffchainStatusLoading,
    error: safeNetOffchainStatusError,
  } = useGetSafeNetOffchainStatusQuery({
    chainId: safe.chainId,
    safeAddress: safe.address.value,
  })
  const [registerSafeNet, { error: registerSafeNetError }] = useRegisterSafeNetMutation()

  const isVersionWithGuards = safeLoaded && hasSafeFeature(SAFE_FEATURES.SAFE_TX_GUARDS, safe.version)
  const isSafeNetGuardEnabled = isVersionWithGuards && sameAddress(safe.guard?.value, SAFENET_GUARD_ADDRESS)
  // @ts-expect-error bad api types
  const offchainLookupError = safeNetOffchainStatusError?.status === 404 ? null : safeNetOffchainStatusError
  const registeredOffchainStatus =
    !offchainLookupError && sameAddress(safeNetOffchainStatus?.guard, SAFENET_GUARD_ADDRESS)
  const needsRegistration = isSafeNetGuardEnabled && !registeredOffchainStatus
  const error = offchainLookupError || registerSafeNetError

  useEffect(() => {
    if (needsRegistration) {
      registerSafeNet({ chainId: safe.chainId, safeAddress: safe.address.value })
    }
  }, [needsRegistration, registerSafeNet, safe.chainId, safe.address.value])

  if (error) {
    throw error
  }

  let safenetContent
  switch (true) {
    case !isVersionWithGuards:
      safenetContent = <div>Please upgrade your Safe to the latest version to use SafeNet</div>
      break
    case isSafeNetGuardEnabled:
      safenetContent = <div>SafeNet is enabled. Enjoy your unified experience.</div>
      break
    case !isSafeNetGuardEnabled:
      safenetContent = (
        <div>
          SafeNet is not enabled. Please enable it to use SafeNet
          <button onClick={() => setTxFlow(<EnableSafenetFlow guardAddress={SAFENET_GUARD_ADDRESS} />)}>Enable</button>
        </div>
      )
      break
    case !safeLoaded || safeNetOffchainStatusLoading:
      safenetContent = <Loading />
      break
    default:
      safenetContent = <></>
  }

  return (
    <>
      <Head>
        <title>{'Safe{Wallet} – Settings – SafeNet'}</title>
      </Head>

      <SettingsHeader />

      <main>
        <Paper data-testid="setup-section" sx={{ p: 4, mb: 2 }}>
          <Grid container spacing={3}>
            <Grid item lg={4} xs={12}>
              <Typography variant="h4" fontWeight={700}>
                <Tooltip
                  placement="top"
                  title="For security reasons, transactions made with a Safe Account need to be executed in order. The nonce shows you which transaction will be executed next. You can find the nonce for a transaction in the transaction details."
                >
                  <span>
                    SafeNet Status
                    <SvgIcon
                      component={InfoIcon}
                      inheritViewBox
                      fontSize="small"
                      color="border"
                      sx={{ verticalAlign: 'middle', ml: 0.5 }}
                    />
                  </span>
                </Tooltip>
              </Typography>
            </Grid>

            <Grid item xs>
              {safenetContent}
            </Grid>
          </Grid>
        </Paper>
      </main>
    </>
  )
}

export default SafeNetPage
