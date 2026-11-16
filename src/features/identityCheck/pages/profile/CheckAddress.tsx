import React, { useState } from 'react'

import { Summary } from 'features/identityCheck/components/Summary'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

import { useCheckAddress } from './useCheckAddress'

export const CheckAddress = () => {
  const { address, city, summaryTitle, onValidate, isLoading, onPressModify, honorStatement } =
    useCheckAddress()
  const [isChecked, setIsChecked] = useState(false)

  return (
    <PageWithHeader
      shouldLimitWidth
      title="Informations"
      scrollChildren={
        <ViewGap gap={6}>
          <Summary
            title={summaryTitle}
            data={[
              { title: 'Adresse', value: address },
              { title: 'Ville de résidence', value: city },
            ]}
          />
          {honorStatement ? (
            <Checkbox
              label="Je déclare que l’ensemble des informations ci-dessus sont correctes."
              isChecked={isChecked}
              onPress={() => setIsChecked(!isChecked)}
              required
            />
          ) : null}
        </ViewGap>
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          <Button
            type="submit"
            wording="Valider mon adresse"
            onPress={onValidate}
            disabled={honorStatement && !isChecked}
            isLoading={isLoading}
          />
          <Button
            type="button"
            variant="secondary"
            wording="Modifier mon adresse"
            onPress={onPressModify}
            disabled={isLoading}
          />
        </ViewGap>
      }
    />
  )
}
