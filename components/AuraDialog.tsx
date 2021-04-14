import React from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { db } from 'utils/firebase'
import AuraComponent from 'components/AuraComponent'

interface Props {
  preview: Aura.SearchAura
}

export const AuraDialog = ({ preview }: Props) => {
  const [aura, loading, error] = useDocumentDataOnce<Aura.Aura>(
    db().collection('auras').doc(preview.id),
  )

  return <AuraComponent aura={aura || preview} />
}

export default AuraDialog
